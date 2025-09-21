const amqp = require('amqplib');
const { Kafka } = require('kafkajs');
const EventEmitter = require('events');
const winston = require('winston');

class EventBus extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      rabbitmq: {
        url: config.rabbitmqUrl || process.env.RABBITMQ_URL || 'amqp://skill_circle:rabbitmq_password@localhost:5672/skill_circle',
        exchange: config.exchange || 'skill_circle_events',
        exchangeType: 'topic'
      },
      kafka: {
        brokers: config.kafkaBrokers || [process.env.KAFKA_BROKERS || 'localhost:9092'],
        clientId: config.kafkaClientId || 'skill-circle-service',
        groupId: config.kafkaGroupId || 'skill-circle-group'
      },
      logger: config.logger || winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [new winston.transports.Console()]
      })
    };

    this.rabbitmqConnection = null;
    this.rabbitmqChannel = null;
    this.kafka = null;
    this.kafkaProducer = null;
    this.kafkaConsumer = null;
    this.isConnected = false;
  }

  // Initialize connections
  async connect() {
    try {
      await this.connectRabbitMQ();
      await this.connectKafka();
      this.isConnected = true;
      this.config.logger.info('EventBus connected successfully');
    } catch (error) {
      this.config.logger.error('Failed to connect EventBus:', error);
      throw error;
    }
  }

  // RabbitMQ Connection
  async connectRabbitMQ() {
    try {
      this.rabbitmqConnection = await amqp.connect(this.config.rabbitmq.url);
      this.rabbitmqChannel = await this.rabbitmqConnection.createChannel();

      // Declare exchange
      await this.rabbitmqChannel.assertExchange(
        this.config.rabbitmq.exchange,
        this.config.rabbitmq.exchangeType,
        { durable: true }
      );

      // Handle connection events
      this.rabbitmqConnection.on('error', (err) => {
        this.config.logger.error('RabbitMQ connection error:', err);
        this.emit('error', err);
      });

      this.rabbitmqConnection.on('close', () => {
        this.config.logger.warn('RabbitMQ connection closed');
        this.emit('disconnect');
      });

      this.config.logger.info('RabbitMQ connected');
    } catch (error) {
      this.config.logger.error('RabbitMQ connection failed:', error);
      throw error;
    }
  }

  // Kafka Connection
  async connectKafka() {
    try {
      this.kafka = new Kafka({
        clientId: this.config.kafka.clientId,
        brokers: this.config.kafka.brokers
      });

      this.kafkaProducer = this.kafka.producer();
      this.kafkaConsumer = this.kafka.consumer({
        groupId: this.config.kafka.groupId
      });

      await this.kafkaProducer.connect();
      await this.kafkaConsumer.connect();

      this.config.logger.info('Kafka connected');
    } catch (error) {
      this.config.logger.error('Kafka connection failed:', error);
      throw error;
    }
  }

  // Publish Event
  async publish(eventType, data, options = {}) {
    if (!this.isConnected) {
      throw new Error('EventBus not connected');
    }

    const event = {
      id: this.generateEventId(),
      type: eventType,
      timestamp: new Date().toISOString(),
      source: options.source || process.env.SERVICE_NAME || 'unknown',
      data,
      metadata: options.metadata || {},
      version: options.version || '1.0'
    };

    try {
      // Publish to RabbitMQ for reliable delivery
      await this.publishToRabbitMQ(event, options);

      // Publish to Kafka for high-throughput streaming
      await this.publishToKafka(event, options);

      this.config.logger.info(`Event published: ${eventType}`, { eventId: event.id });
      this.emit('published', event);

      return event.id;
    } catch (error) {
      this.config.logger.error(`Failed to publish event: ${eventType}`, error);
      this.emit('error', error);
      throw error;
    }
  }

  // Publish to RabbitMQ
  async publishToRabbitMQ(event, options) {
    const routingKey = options.routingKey || event.type;
    const messageOptions = {
      persistent: true,
      messageId: event.id,
      timestamp: Date.now(),
      headers: {
        eventType: event.type,
        source: event.source,
        version: event.version
      }
    };

    await this.rabbitmqChannel.publish(
      this.config.rabbitmq.exchange,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      messageOptions
    );
  }

  // Publish to Kafka
  async publishToKafka(event, options) {
    const topic = options.topic || this.getKafkaTopicFromEventType(event.type);

    await this.kafkaProducer.send({
      topic,
      messages: [{
        key: event.id,
        value: JSON.stringify(event),
        headers: {
          eventType: event.type,
          source: event.source,
          version: event.version
        }
      }]
    });
  }

  // Subscribe to Events (RabbitMQ)
  async subscribe(eventPattern, handler, options = {}) {
    if (!this.isConnected) {
      throw new Error('EventBus not connected');
    }

    try {
      const queueName = options.queueName || `${this.config.kafka.groupId}.${eventPattern}`;

      // Assert queue
      const queue = await this.rabbitmqChannel.assertQueue(queueName, {
        durable: true,
        exclusive: false,
        autoDelete: false
      });

      // Bind queue to exchange
      await this.rabbitmqChannel.bindQueue(queue.queue, this.config.rabbitmq.exchange, eventPattern);

      // Consume messages
      await this.rabbitmqChannel.consume(queue.queue, async (message) => {
        if (message) {
          try {
            const event = JSON.parse(message.content.toString());

            this.config.logger.info(`Event received: ${event.type}`, { eventId: event.id });

            await handler(event, {
              ack: () => this.rabbitmqChannel.ack(message),
              nack: () => this.rabbitmqChannel.nack(message, false, true),
              reject: () => this.rabbitmqChannel.reject(message, false)
            });

            // Auto-ack if not manually handled
            if (options.autoAck !== false) {
              this.rabbitmqChannel.ack(message);
            }
          } catch (error) {
            this.config.logger.error('Error processing event:', error);
            this.rabbitmqChannel.nack(message, false, !options.requeue);
          }
        }
      });

      this.config.logger.info(`Subscribed to events: ${eventPattern}`);
    } catch (error) {
      this.config.logger.error(`Failed to subscribe to events: ${eventPattern}`, error);
      throw error;
    }
  }

  // Subscribe to Kafka Topics
  async subscribeKafka(topics, handler, options = {}) {
    if (!this.isConnected) {
      throw new Error('EventBus not connected');
    }

    try {
      await this.kafkaConsumer.subscribe({
        topics: Array.isArray(topics) ? topics : [topics],
        fromBeginning: options.fromBeginning || false
      });

      await this.kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const event = JSON.parse(message.value.toString());

            this.config.logger.info(`Kafka event received: ${event.type}`, {
              eventId: event.id,
              topic,
              partition,
              offset: message.offset
            });

            await handler(event, {
              topic,
              partition,
              offset: message.offset,
              headers: message.headers
            });
          } catch (error) {
            this.config.logger.error('Error processing Kafka event:', error);
            // Implement dead letter queue logic if needed
          }
        }
      });

      this.config.logger.info(`Subscribed to Kafka topics: ${topics}`);
    } catch (error) {
      this.config.logger.error(`Failed to subscribe to Kafka topics: ${topics}`, error);
      throw error;
    }
  }

  // Event Replay (from Event Store)
  async replayEvents(streamName, fromEvent = 0, handler) {
    // Implementation for EventStore integration
    // This would connect to EventStore and replay events
    this.config.logger.info(`Replaying events from stream: ${streamName}, from event: ${fromEvent}`);
  }

  // Utility Methods
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getKafkaTopicFromEventType(eventType) {
    // Convert event type to Kafka topic naming convention
    return eventType.toLowerCase().replace(/\./g, '_').replace(/([a-z])([A-Z])/g, '$1_$2');
  }

  // Graceful Shutdown
  async disconnect() {
    this.config.logger.info('Disconnecting EventBus...');

    try {
      if (this.kafkaProducer) {
        await this.kafkaProducer.disconnect();
      }
      if (this.kafkaConsumer) {
        await this.kafkaConsumer.disconnect();
      }
      if (this.rabbitmqConnection) {
        await this.rabbitmqConnection.close();
      }

      this.isConnected = false;
      this.config.logger.info('EventBus disconnected');
    } catch (error) {
      this.config.logger.error('Error disconnecting EventBus:', error);
    }
  }

  // Health Check
  async healthCheck() {
    const health = {
      rabbitmq: false,
      kafka: false,
      overall: false
    };

    try {
      // Check RabbitMQ
      if (this.rabbitmqConnection && !this.rabbitmqConnection.connection.destroyed) {
        health.rabbitmq = true;
      }

      // Check Kafka (simple check - in production you might want more sophisticated checks)
      if (this.kafkaProducer && this.kafkaConsumer) {
        health.kafka = true;
      }

      health.overall = health.rabbitmq && health.kafka;
    } catch (error) {
      this.config.logger.error('Health check error:', error);
    }

    return health;
  }
}

module.exports = EventBus;