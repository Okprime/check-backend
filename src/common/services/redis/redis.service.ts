import { Injectable } from '@nestjs/common';

import * as redis from 'redis';
import * as asyncRedis from 'async-redis';
import { ConfigService } from '@nestjs/config';
import { appConstant } from '../../constants/app.constant';

@Injectable()
export class RedisService {
  port: number;
  host: string;
  password: string;
  client: any;

  constructor(configService: ConfigService) {
    this.port = parseInt(configService.get('REDIS_SERVER_PORT'));
    this.host = configService.get('REDIS_SERVER_HOST');
    this.password = configService.get('REDIS_SERVER_PASSWORD');

    const redisClient = redis.createClient(
      `redis://:${this.password}@${this.host}:${this.port}`,
    );

    this.client = asyncRedis.decorate(redisClient);

    this.client.on('error', () => {
      throw new Error(appConstant.REDIS_CONNECTION_FAILED);
    });
  }

  async set(
    key,
    value: string,
    duration = appConstant.REDIS.MODE.REDIS_DURATION,
    ex = appConstant.REDIS.MODE.EX,
  ) {
    return await this.client.set(key, value, ex, duration);
  }

  async get(key: string): Promise<string | boolean | any> {
    if (key !== null && key !== undefined && key !== 'undefined') {
      return await this.client.get(key);
    }
  }

  async delete(key: string) {
    if (key !== null && key !== undefined && key !== 'undefined') {
      return await this.client.del(key);
    }
  }
}
