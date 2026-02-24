const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true, // Don't crash on startup if Redis is down
    retryStrategy: (times) => {
        if (times > 3) {
            console.warn('⚠️ Redis unreachable after 3 attempts. Switching to In-Memory Fallback.');
            return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
    }
});

// In-Memory Fallback for Development (if Redis is down)
const memoryStore = new Map();
const fallbackClient = {
    isFallback: true,
    hset: async (key, field, value) => {
        if (typeof field === 'object') {
            memoryStore.set(key, { ...field });
        } else {
            const data = memoryStore.get(key) || {};
            data[field] = value;
            memoryStore.set(key, data);
        }
    },
    hgetall: async (key) => memoryStore.get(key),
    hincrby: async (key, field, increment) => {
        const data = memoryStore.get(key) || {};
        data[field] = (parseInt(data[field]) || 0) + increment;
        memoryStore.set(key, data);
    },
    set: async (key, value, mode, duration) => {
        memoryStore.set(key, value);
        if (duration) setTimeout(() => memoryStore.delete(key), duration * 1000);
    },
    exists: async (key) => memoryStore.has(key) ? 1 : 0,
    del: async (key) => memoryStore.delete(key),
    expire: async (key, seconds) => {
        setTimeout(() => memoryStore.delete(key), seconds * 1000);
    }
};

let activeClient = redisClient;

redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
    activeClient = redisClient;
});

redisClient.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        console.error('❌ Redis Connection Refused at 127.0.0.1:6379.');
        console.info('💡 TIP: Start Redis server or we will continue using In-Memory Fallback.');
        activeClient = fallbackClient;
    } else {
        console.error('❌ Redis Error:', err.message);
    }
});

// Export a proxy to handle the switching
module.exports = new Proxy({}, {
    get: (target, prop) => {
        // If Redis is connected, use it. Otherwise, use fallback.
        const useFallback = activeClient === fallbackClient || redisClient.status !== 'ready';
        const client = useFallback ? fallbackClient : redisClient;

        if (typeof client[prop] === 'function') {
            return async (...args) => {
                try {
                    // If we are trying to use the real redisClient, check its status
                    if (client === redisClient && redisClient.status !== 'ready') {
                        throw new Error('Connection is closed');
                    }
                    return await client[prop].apply(client, args);
                } catch (err) {
                    // Failover logic
                    if (client === redisClient) {
                        console.warn(`⚠️ Redis Failover: [${prop}] failed (${err.message}). Using Memory Store.`);
                        activeClient = fallbackClient;
                        return await fallbackClient[prop].apply(fallbackClient, args);
                    }
                    throw err;
                }
            };
        }
        return client[prop];
    }
});
