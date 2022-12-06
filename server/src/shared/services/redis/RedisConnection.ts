import logger from '@/utils/logger';
import { BaseCache } from './BaseCache';

class RedisConnection extends BaseCache {
  constructor() {
    super('Redis Connection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (err) {
      logger.error(err);
    }
  }
}

export const redisConnection = new RedisConnection();
