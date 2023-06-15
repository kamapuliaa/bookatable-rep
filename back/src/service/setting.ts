import { PoolConfig } from "pg";
import { RedisClientOptions } from "redis";

export class Setting {
  db: PoolConfig;

  cache: { redis: RedisClientOptions, defaultTTL: number };

  constructor() {
    this.db = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    }
    this.cache = {
      redis: {
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379')
        }
      },
      defaultTTL: 60 * 60
    }
  }
}