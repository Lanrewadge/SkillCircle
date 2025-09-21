const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');

class EventStore extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      storage: config.storage || 'memory', // 'memory', 'postgres', 'eventstore'
      batchSize: config.batchSize || 100,
      snapshotFrequency: config.snapshotFrequency || 10,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000
    };

    this.events = new Map(); // streamId -> events[]
    this.snapshots = new Map(); // streamId -> snapshot
    this.eventHandlers = new Map(); // eventType -> handlers[]
    this.projections = new Map(); // projectionId -> projection

    this.setupStorage();
  }

  // Initialize storage backend
  async setupStorage() {
    switch (this.config.storage) {
      case 'postgres':
        await this.setupPostgresStorage();
        break;
      case 'eventstore':
        await this.setupEventStoreDB();
        break;
      default:
        console.log('Using in-memory event store');
    }
  }

  // PostgreSQL storage setup
  async setupPostgresStorage() {
    const { Pool } = require('pg');
    this.pool = new Pool({
      connectionString: process.env.EVENTSTORE_DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000
    });

    // Create tables if they don't exist
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY,
        stream_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(255) NOT NULL,
        event_data JSONB NOT NULL,
        metadata JSONB,
        version INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS snapshots (
        stream_id VARCHAR(255) PRIMARY KEY,
        version INTEGER NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_events_stream_id ON events(stream_id);
      CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
      CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
    `);

    console.log('PostgreSQL event store initialized');
  }

  // EventStore DB setup
  async setupEventStoreDB() {
    const { EventStoreDBClient } = require('@eventstore/db-client');

    this.client = EventStoreDBClient.connectionString(
      process.env.EVENTSTORE_CONNECTION_STRING || 'esdb://localhost:2113?tls=false'
    );

    console.log('EventStore DB client initialized');
  }

  // Append events to stream
  async appendToStream(streamId, events, expectedVersion = -1) {
    try {
      const normalizedEvents = events.map(event => this.normalizeEvent(event));

      switch (this.config.storage) {
        case 'postgres':
          return await this.appendToPostgres(streamId, normalizedEvents, expectedVersion);
        case 'eventstore':
          return await this.appendToEventStore(streamId, normalizedEvents, expectedVersion);
        default:
          return await this.appendToMemory(streamId, normalizedEvents, expectedVersion);
      }
    } catch (error) {
      console.error('Failed to append events:', error);
      throw error;
    }
  }

  // Memory storage implementation
  async appendToMemory(streamId, events, expectedVersion) {
    if (!this.events.has(streamId)) {
      this.events.set(streamId, []);
    }

    const streamEvents = this.events.get(streamId);
    const currentVersion = streamEvents.length;

    // Optimistic concurrency check
    if (expectedVersion !== -1 && expectedVersion !== currentVersion) {
      throw new Error(`Concurrency conflict: expected version ${expectedVersion}, but current version is ${currentVersion}`);
    }

    // Append events with version numbers
    const appendedEvents = events.map((event, index) => ({
      ...event,
      version: currentVersion + index + 1,
      createdAt: new Date().toISOString()
    }));

    streamEvents.push(...appendedEvents);

    // Emit events for projections
    for (const event of appendedEvents) {
      this.emit('event', { streamId, event });
      this.emit(`event:${event.eventType}`, { streamId, event });
    }

    return {
      streamId,
      version: currentVersion + events.length,
      events: appendedEvents
    };
  }

  // PostgreSQL storage implementation
  async appendToPostgres(streamId, events, expectedVersion) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Check current version
      const versionResult = await client.query(
        'SELECT COALESCE(MAX(version), 0) as current_version FROM events WHERE stream_id = $1',
        [streamId]
      );

      const currentVersion = parseInt(versionResult.rows[0].current_version);

      if (expectedVersion !== -1 && expectedVersion !== currentVersion) {
        throw new Error(`Concurrency conflict: expected version ${expectedVersion}, but current version is ${currentVersion}`);
      }

      // Insert events
      const appendedEvents = [];
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const version = currentVersion + i + 1;

        const result = await client.query(
          'INSERT INTO events (id, stream_id, event_type, event_data, metadata, version) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [event.id, streamId, event.eventType, event.data, event.metadata, version]
        );

        appendedEvents.push({
          ...event,
          version,
          createdAt: result.rows[0].created_at
        });
      }

      await client.query('COMMIT');

      // Emit events for projections
      for (const event of appendedEvents) {
        this.emit('event', { streamId, event });
        this.emit(`event:${event.eventType}`, { streamId, event });
      }

      return {
        streamId,
        version: currentVersion + events.length,
        events: appendedEvents
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Read events from stream
  async readStream(streamId, fromVersion = 0, maxCount = 1000) {
    switch (this.config.storage) {
      case 'postgres':
        return await this.readFromPostgres(streamId, fromVersion, maxCount);
      case 'eventstore':
        return await this.readFromEventStore(streamId, fromVersion, maxCount);
      default:
        return await this.readFromMemory(streamId, fromVersion, maxCount);
    }
  }

  // Memory read implementation
  async readFromMemory(streamId, fromVersion, maxCount) {
    const streamEvents = this.events.get(streamId) || [];
    const filteredEvents = streamEvents
      .filter(event => event.version > fromVersion)
      .slice(0, maxCount);

    return {
      streamId,
      events: filteredEvents,
      fromVersion,
      nextVersion: filteredEvents.length > 0 ? filteredEvents[filteredEvents.length - 1].version : fromVersion
    };
  }

  // PostgreSQL read implementation
  async readFromPostgres(streamId, fromVersion, maxCount) {
    const result = await this.pool.query(
      'SELECT * FROM events WHERE stream_id = $1 AND version > $2 ORDER BY version LIMIT $3',
      [streamId, fromVersion, maxCount]
    );

    const events = result.rows.map(row => ({
      id: row.id,
      eventType: row.event_type,
      data: row.event_data,
      metadata: row.metadata,
      version: row.version,
      createdAt: row.created_at
    }));

    return {
      streamId,
      events,
      fromVersion,
      nextVersion: events.length > 0 ? events[events.length - 1].version : fromVersion
    };
  }

  // Read all events (for projections)
  async readAllEvents(fromPosition = 0, maxCount = 1000) {
    switch (this.config.storage) {
      case 'postgres':
        const result = await this.pool.query(
          'SELECT * FROM events WHERE version > $1 ORDER BY created_at, version LIMIT $2',
          [fromPosition, maxCount]
        );

        return result.rows.map(row => ({
          streamId: row.stream_id,
          event: {
            id: row.id,
            eventType: row.event_type,
            data: row.event_data,
            metadata: row.metadata,
            version: row.version,
            createdAt: row.created_at
          }
        }));

      default:
        const allEvents = [];
        for (const [streamId, events] of this.events.entries()) {
          for (const event of events) {
            if (event.version > fromPosition) {
              allEvents.push({ streamId, event });
            }
          }
        }

        return allEvents
          .sort((a, b) => new Date(a.event.createdAt) - new Date(b.event.createdAt))
          .slice(0, maxCount);
    }
  }

  // Normalize event format
  normalizeEvent(event) {
    return {
      id: event.id || uuidv4(),
      eventType: event.eventType || event.type,
      data: event.data || event.payload || {},
      metadata: {
        ...event.metadata,
        correlationId: event.correlationId,
        causationId: event.causationId,
        userId: event.userId,
        timestamp: event.timestamp || new Date().toISOString()
      }
    };
  }

  // Snapshot management
  async saveSnapshot(streamId, version, data) {
    switch (this.config.storage) {
      case 'postgres':
        await this.pool.query(
          'INSERT INTO snapshots (stream_id, version, data) VALUES ($1, $2, $3) ON CONFLICT (stream_id) DO UPDATE SET version = $2, data = $3, created_at = NOW()',
          [streamId, version, data]
        );
        break;

      default:
        this.snapshots.set(streamId, { version, data, createdAt: new Date() });
    }
  }

  async getSnapshot(streamId) {
    switch (this.config.storage) {
      case 'postgres':
        const result = await this.pool.query(
          'SELECT * FROM snapshots WHERE stream_id = $1',
          [streamId]
        );

        return result.rows.length > 0 ? {
          version: result.rows[0].version,
          data: result.rows[0].data,
          createdAt: result.rows[0].created_at
        } : null;

      default:
        return this.snapshots.get(streamId) || null;
    }
  }

  // Aggregate reconstruction
  async reconstructAggregate(streamId, AggregateClass, toVersion = -1) {
    // Try to get snapshot first
    const snapshot = await this.getSnapshot(streamId);
    let aggregate = new AggregateClass();
    let fromVersion = 0;

    if (snapshot && (toVersion === -1 || snapshot.version <= toVersion)) {
      aggregate = AggregateClass.fromSnapshot(snapshot.data);
      fromVersion = snapshot.version;
    }

    // Apply events since snapshot
    const { events } = await this.readStream(streamId, fromVersion, toVersion === -1 ? 1000 : toVersion - fromVersion);

    for (const event of events) {
      if (toVersion === -1 || event.version <= toVersion) {
        aggregate.applyEvent(event);
      }
    }

    // Save snapshot if needed
    if (events.length >= this.config.snapshotFrequency) {
      await this.saveSnapshot(streamId, aggregate.version, aggregate.toSnapshot());
    }

    return aggregate;
  }

  // Projection management
  registerProjection(projectionId, projection) {
    this.projections.set(projectionId, projection);

    // Subscribe to relevant events
    if (projection.eventTypes) {
      projection.eventTypes.forEach(eventType => {
        this.on(`event:${eventType}`, async ({ streamId, event }) => {
          try {
            await projection.handle(streamId, event);
          } catch (error) {
            console.error(`Projection ${projectionId} failed to handle event:`, error);
          }
        });
      });
    } else {
      // Handle all events
      this.on('event', async ({ streamId, event }) => {
        try {
          await projection.handle(streamId, event);
        } catch (error) {
          console.error(`Projection ${projectionId} failed to handle event:`, error);
        }
      });
    }

    console.log(`Projection registered: ${projectionId}`);
  }

  // Rebuild projection
  async rebuildProjection(projectionId, fromPosition = 0) {
    const projection = this.projections.get(projectionId);
    if (!projection) {
      throw new Error(`Projection ${projectionId} not found`);
    }

    console.log(`Rebuilding projection: ${projectionId}`);

    // Reset projection state
    if (projection.reset) {
      await projection.reset();
    }

    // Replay all events
    let position = fromPosition;
    let hasMore = true;

    while (hasMore) {
      const events = await this.readAllEvents(position, this.config.batchSize);

      if (events.length === 0) {
        hasMore = false;
        break;
      }

      for (const { streamId, event } of events) {
        if (!projection.eventTypes || projection.eventTypes.includes(event.eventType)) {
          await projection.handle(streamId, event);
        }
        position = Math.max(position, event.version);
      }
    }

    console.log(`Projection ${projectionId} rebuilt successfully`);
  }

  // Event subscription
  subscribeToStream(streamId, handler, fromVersion = 0) {
    const subscriptionId = uuidv4();

    // Handle existing events
    this.readStream(streamId, fromVersion).then(({ events }) => {
      events.forEach(event => handler(event));
    });

    // Handle new events
    const eventHandler = ({ streamId: eventStreamId, event }) => {
      if (eventStreamId === streamId && event.version > fromVersion) {
        handler(event);
      }
    };

    this.on('event', eventHandler);

    return {
      subscriptionId,
      unsubscribe: () => this.off('event', eventHandler)
    };
  }

  // Global event subscription
  subscribeToAll(handler, fromPosition = 0) {
    const subscriptionId = uuidv4();

    // Handle existing events
    this.readAllEvents(fromPosition).then(events => {
      events.forEach(({ streamId, event }) => handler(streamId, event));
    });

    // Handle new events
    const eventHandler = ({ streamId, event }) => {
      handler(streamId, event);
    };

    this.on('event', eventHandler);

    return {
      subscriptionId,
      unsubscribe: () => this.off('event', eventHandler)
    };
  }

  // Health check
  async healthCheck() {
    try {
      switch (this.config.storage) {
        case 'postgres':
          await this.pool.query('SELECT 1');
          return { status: 'healthy', storage: 'postgres' };

        case 'eventstore':
          // Add EventStore health check
          return { status: 'healthy', storage: 'eventstore' };

        default:
          return { status: 'healthy', storage: 'memory' };
      }
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Graceful shutdown
  async close() {
    if (this.pool) {
      await this.pool.end();
    }

    if (this.client) {
      // Close EventStore connection
    }

    this.removeAllListeners();
    console.log('Event store closed');
  }
}

// Base Aggregate class
class Aggregate {
  constructor() {
    this.id = null;
    this.version = 0;
    this.uncommittedEvents = [];
  }

  // Apply event to aggregate
  applyEvent(event) {
    const handler = this[`on${event.eventType}`];
    if (handler) {
      handler.call(this, event.data, event.metadata);
    }
    this.version = event.version || this.version + 1;
  }

  // Raise new event
  raiseEvent(eventType, data, metadata = {}) {
    const event = {
      id: uuidv4(),
      eventType,
      data,
      metadata: {
        ...metadata,
        aggregateId: this.id,
        aggregateType: this.constructor.name
      }
    };

    this.uncommittedEvents.push(event);
    this.applyEvent(event);
    return event;
  }

  // Get uncommitted events
  getUncommittedEvents() {
    return [...this.uncommittedEvents];
  }

  // Mark events as committed
  markEventsAsCommitted() {
    this.uncommittedEvents = [];
  }

  // Snapshot support
  toSnapshot() {
    return {
      id: this.id,
      version: this.version,
      data: this.getSnapshotData()
    };
  }

  static fromSnapshot(snapshot) {
    const aggregate = new this();
    aggregate.id = snapshot.id;
    aggregate.version = snapshot.version;
    aggregate.loadFromSnapshot(snapshot.data);
    return aggregate;
  }

  // Override in subclasses
  getSnapshotData() {
    return {};
  }

  loadFromSnapshot(data) {
    // Override in subclasses
  }
}

module.exports = { EventStore, Aggregate };