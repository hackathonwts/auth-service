"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = void 0;
const ioredis_1 = require("ioredis");
const redis_constant_1 = require("./redis.constant");
exports.RedisProvider = {
    provide: redis_constant_1.REDIS_CONNECTION,
    useFactory: async () => {
        const redisUrl = process.env.REDIS_URL;
        const redis = redisUrl
            ? new ioredis_1.Redis(redisUrl, {
                maxRetriesPerRequest: null,
            })
            : new ioredis_1.Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: +process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || undefined,
                maxRetriesPerRequest: null,
            });
        redis.on('connect', () => console.log('✅ Connected to Redis'));
        redis.on('error', (err) => console.error('❌ Redis error:', err));
        return redis;
    },
};
