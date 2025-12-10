import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_TOKEN = Symbol('REDIS_TOKEN');

export const RedisProvider: Provider = {
  provide: REDIS_TOKEN,
  useFactory: () => {
    return new Redis(process.env.REDIS_URL ?? '', {
      maxRetriesPerRequest: 3,
      connectTimeout: 10_000,
      lazyConnect: true,
    });
  },
};