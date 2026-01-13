import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CONNECTION } from './redis.constant';


export const RedisProvider: Provider = {
  provide: REDIS_CONNECTION,
  useFactory: async () => {
    const redisUrl = process.env.REDIS_URL;

    const redis = redisUrl
      ? new Redis(redisUrl, {
          maxRetriesPerRequest: null,
        })
      : new Redis({
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
