import pg from 'pg';
import { Setting } from './setting';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<pg.PoolClient>();

export default class Database {
  private static instance: Database;
  private pool: pg.Pool;

  private constructor(setting: Setting) {
    this.pool = new pg.Pool(setting.db);
  }

  public static getInstance(setting: Setting): Database {
    if (!Database.instance) {
      Database.instance = new Database(setting);
    }

    return Database.instance;
  }

  public async query(query: pg.QueryConfig): Promise<any[]> {
    const id = asyncLocalStorage.getStore();
    if (!id) {
      const client = await this.pool.connect();
      try {
        console.log('query', query.text);
        const { rows } = await client.query(query);
        return rows;
      } finally {
        client.release();
      }
    }
    const { rows } = await id.query(query);
    return rows;
  }

  public async getClient<T>(cb: () => Promise<T>) {
    const session = await this.pool.connect();
    return asyncLocalStorage.run(session, async () => {
      try {
        await session.query('BEGIN');
        const result = await cb();
        await session.query('COMMIT');
        return result;
      } catch (e) {
        await session.query('ROLLBACK');
        throw e;
      } finally {
        session.release();
      }
    });
  }
}