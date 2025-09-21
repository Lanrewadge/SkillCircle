const redis = require('redis');
const NodeCache = require('node-cache');

class CacheManager {
  constructor(config = {}) {
    this.config = {
      redis: {
        host: config.redisHost || process.env.REDIS_HOST || 'localhost',
        port: config.redisPort || process.env.REDIS_PORT || 6379,
        password: config.redisPassword || process.env.REDIS_PASSWORD,
        db: config.redisDb || 0
      },
      memory: {
        stdTTL: config.memoryTTL || 600, // 10 minutes
        checkperiod: config.checkPeriod || 120 // 2 minutes
      },
      defaultTTL: config.defaultTTL || 3600, // 1 hour
      keyPrefix: config.keyPrefix || 'skill-circle:'
    };

    this.redisClient = null;
    this.memoryCache = new NodeCache(this.config.memory);
    this.isConnected = false;
  }

  // Initialize Redis connection
  async connect() {
    try {
      this.redisClient = redis.createClient(this.config.redis);

      this.redisClient.on('error', (err) => {
        console.error('Redis error:', err);
      });

      this.redisClient.on('connect', () => {
        console.log('Redis connected');
        this.isConnected = true;
      });

      this.redisClient.on('disconnect', () => {
        console.log('Redis disconnected');
        this.isConnected = false;
      });

      await this.redisClient.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      // Continue with memory cache only
    }
  }

  // Generate cache key
  generateKey(namespace, key, params = {}) {
    const keyParts = [this.config.keyPrefix, namespace, key];

    if (Object.keys(params).length > 0) {
      const paramString = Object.keys(params)
        .sort()
        .map(k => `${k}:${params[k]}`)
        .join('|');
      keyParts.push(paramString);
    }

    return keyParts.join(':');
  }

  // Multi-level caching strategy
  async get(namespace, key, params = {}) {
    const cacheKey = this.generateKey(namespace, key, params);

    try {
      // Level 1: Memory cache (fastest)
      const memoryResult = this.memoryCache.get(cacheKey);
      if (memoryResult !== undefined) {
        return {
          data: memoryResult,
          source: 'memory',
          key: cacheKey
        };
      }

      // Level 2: Redis cache (fast)
      if (this.isConnected) {
        const redisResult = await this.redisClient.get(cacheKey);
        if (redisResult !== null) {
          const data = JSON.parse(redisResult);

          // Populate memory cache for next access
          this.memoryCache.set(cacheKey, data, this.config.memory.stdTTL);

          return {
            data,
            source: 'redis',
            key: cacheKey
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cache with multi-level strategy
  async set(namespace, key, data, ttl = null, params = {}) {
    const cacheKey = this.generateKey(namespace, key, params);
    const cacheTTL = ttl || this.config.defaultTTL;

    try {
      // Set in memory cache
      this.memoryCache.set(cacheKey, data, Math.min(cacheTTL, this.config.memory.stdTTL));

      // Set in Redis cache
      if (this.isConnected) {
        await this.redisClient.setEx(cacheKey, cacheTTL, JSON.stringify(data));
      }

      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete from all cache levels
  async delete(namespace, key, params = {}) {
    const cacheKey = this.generateKey(namespace, key, params);

    try {
      // Delete from memory cache
      this.memoryCache.del(cacheKey);

      // Delete from Redis cache
      if (this.isConnected) {
        await this.redisClient.del(cacheKey);
      }

      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear cache by pattern
  async clear(namespace, pattern = '*') {
    try {
      const searchPattern = this.generateKey(namespace, pattern);

      // Clear memory cache
      const memoryKeys = this.memoryCache.keys();
      memoryKeys.forEach(key => {
        if (key.startsWith(this.generateKey(namespace, ''))) {
          this.memoryCache.del(key);
        }
      });

      // Clear Redis cache
      if (this.isConnected) {
        const keys = await this.redisClient.keys(searchPattern);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }

      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Cache-aside pattern implementation
  async getOrSet(namespace, key, fetchFunction, ttl = null, params = {}) {
    try {
      // Try to get from cache first
      const cached = await this.get(namespace, key, params);
      if (cached) {
        return cached.data;
      }

      // Data not in cache, fetch from source
      const data = await fetchFunction();

      // Store in cache for next time
      await this.set(namespace, key, data, ttl, params);

      return data;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      // If cache fails, still try to fetch from source
      return await fetchFunction();
    }
  }

  // Write-through pattern
  async writeThrough(namespace, key, data, updateFunction, ttl = null, params = {}) {
    try {
      // Update the data source first
      const result = await updateFunction(data);

      // Then update the cache
      await this.set(namespace, key, result, ttl, params);

      return result;
    } catch (error) {
      console.error('Cache writeThrough error:', error);
      throw error;
    }
  }

  // Write-behind pattern (async cache update)
  async writeBehind(namespace, key, data, updateFunction, ttl = null, params = {}) {
    try {
      // Update cache immediately
      await this.set(namespace, key, data, ttl, params);

      // Update data source asynchronously
      setImmediate(async () => {
        try {
          await updateFunction(data);
        } catch (error) {
          console.error('Write-behind update error:', error);
          // Optionally invalidate cache on failure
          await this.delete(namespace, key, params);
        }
      });

      return data;
    } catch (error) {
      console.error('Cache writeBehind error:', error);
      throw error;
    }
  }

  // Cache warming
  async warm(namespace, items, fetchFunction, ttl = null) {
    try {
      const promises = items.map(async (item) => {
        const key = typeof item === 'object' ? item.key : item;
        const params = typeof item === 'object' ? item.params : {};

        try {
          const data = await fetchFunction(item);
          await this.set(namespace, key, data, ttl, params);
        } catch (error) {
          console.error(`Failed to warm cache for ${key}:`, error);
        }
      });

      await Promise.allSettled(promises);
      console.log(`Cache warmed for ${items.length} items in namespace: ${namespace}`);
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }

  // Cache statistics
  getStats() {
    const memoryStats = this.memoryCache.getStats();

    return {
      memory: {
        keys: memoryStats.keys,
        hits: memoryStats.hits,
        misses: memoryStats.misses,
        hitRate: memoryStats.hits / (memoryStats.hits + memoryStats.misses) || 0
      },
      redis: {
        connected: this.isConnected
      }
    };
  }

  // Health check
  async healthCheck() {
    const health = {
      memory: true,
      redis: this.isConnected,
      overall: false
    };

    try {
      // Test memory cache
      const testKey = 'health-check-test';
      this.memoryCache.set(testKey, 'test', 10);
      const memoryTest = this.memoryCache.get(testKey);
      health.memory = memoryTest === 'test';
      this.memoryCache.del(testKey);

      // Test Redis cache
      if (this.isConnected) {
        const redisTestKey = this.generateKey('health', 'test');
        await this.redisClient.setEx(redisTestKey, 10, 'test');
        const redisTest = await this.redisClient.get(redisTestKey);
        health.redis = redisTest === 'test';
        await this.redisClient.del(redisTestKey);
      }

      health.overall = health.memory && (health.redis || !this.config.redis.host);
    } catch (error) {
      console.error('Cache health check error:', error);
      health.overall = false;
    }

    return health;
  }

  // Graceful shutdown
  async disconnect() {
    try {
      this.memoryCache.close();

      if (this.redisClient) {
        await this.redisClient.quit();
      }

      this.isConnected = false;
      console.log('Cache manager disconnected');
    } catch (error) {
      console.error('Cache disconnect error:', error);
    }
  }
}

// Cache decorators for common patterns
const cacheDecorators = {
  // Memoize function results
  memoize: (cacheManager, namespace, ttl = 3600) => {
    return (target, propertyName, descriptor) => {
      const method = descriptor.value;

      descriptor.value = async function(...args) {
        const key = `${propertyName}:${JSON.stringify(args)}`;

        return await cacheManager.getOrSet(
          namespace,
          key,
          () => method.apply(this, args),
          ttl
        );
      };

      return descriptor;
    };
  },

  // Cache method results with TTL
  cached: (cacheManager, namespace, keyGenerator, ttl = 3600) => {
    return (target, propertyName, descriptor) => {
      const method = descriptor.value;

      descriptor.value = async function(...args) {
        const key = keyGenerator ? keyGenerator(...args) : propertyName;

        return await cacheManager.getOrSet(
          namespace,
          key,
          () => method.apply(this, args),
          ttl
        );
      };

      return descriptor;
    };
  },

  // Invalidate cache after method execution
  invalidate: (cacheManager, namespace, keyGenerator) => {
    return (target, propertyName, descriptor) => {
      const method = descriptor.value;

      descriptor.value = async function(...args) {
        const result = await method.apply(this, args);

        const key = keyGenerator ? keyGenerator(...args) : '*';
        await cacheManager.clear(namespace, key);

        return result;
      };

      return descriptor;
    };
  }
};

module.exports = {
  CacheManager,
  cacheDecorators
};