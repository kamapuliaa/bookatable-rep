import { type RedisClientType, createClient, type RedisModules, type RedisFunctions, type RedisScripts } from 'redis';
import type { Setting } from './setting';
import { isDeepStrictEqual } from 'util';
import { EventEmitter } from 'stream';

export class Cache {
  cache: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  constructor(private setting: Setting) {
    this.cache = createClient(setting.cache.redis);
    this.cache.connect();
  }

  get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }

  async set(key: string, value: string, expire?: number): Promise<void> {
    if (typeof expire === 'number') {
      await this.cache.set(key, value, { EX: expire });
    } else {
      await this.cache.set(key, value, { EX: this.setting.cache.defaultTTL });
    }
  }
}

export function groupCalls<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Promise<Return>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
) {
  let promiseWait: [Args, Promise<Return>][] = [];
  function replacementMethod(this: This, ...args: Args) {
    const same = promiseWait.find((p) => isDeepStrictEqual(p[0], args));
    if (same) {
      return same[1];
    }
    const promise = target.apply(this, args);
    promiseWait.push([args, promise]);
    promise.finally(() => {
      promiseWait = promiseWait.filter((p) => p[1] !== promise);
    });
    return promise;
  }
  return replacementMethod;
}

type ResponseKeyType = string | [key: string, ttl: number] | { key: string, ttl: number } | null;

function getGetterSetter<Result>(cache: Cache, v: ResponseKeyType) {
  let key: string;
  let ttl: number | undefined;
  if (typeof v === 'string') {
    key = v;
  } else if (Array.isArray(v)) {
    key = v[0];
    ttl = v[1];
  } else if (v && typeof v === 'object') {
    key = v.key;
    ttl = v.ttl;
  } else {
    return {
      get: async function () {
        return null;
      },
      set: async function () {}
    }
  }
  return {
    get: async function (): Promise<Result | null | undefined> {
      try {
        const result = await cache.get(key);
        if (!result) {
          return null;
        }
        return JSON.parse(result);
      } catch (e) {
        // ignore
      }
    },
    set: async function (value: Result) {
      try {
        const result = JSON.stringify(value);
        if (typeof ttl === 'number') {
          await cache.set(key, result, ttl);
        } else {
          await cache.set(key, result);
        }
      } catch (e) {
        // ignore
      }
    }
  }
}

export class CacheEventEmitter  extends EventEmitter {
  
  emit(event: 'set', key: string): boolean;
  emit(event: 'delete', key: string): boolean;
  emit(event: 'get', key: string): boolean;
  emit(key: string, ...opt: any[]): boolean {
    return super.emit(key, ...opt);
  }
  
  on(event: 'set', listener: (key: string) => void): this;
  on(event: 'delete', listener: (key: string) => void): this;
  on(event: 'get', listener: (key: string) => void): this;
  on(key: string, listener: (...opt: any[]) => void): this {
    return super.on(key, listener);
  }
  
  once(event: 'set', listener: (key: string) => void): this;
  once(event: 'delete', listener: (key: string) => void): this;
  once(event: 'get', listener: (key: string) => void): this;
  once(key: string, listener: (...opt: any[]) => void): this {
    return super.once(key, listener);
  }
} 

export type CacheParams<Args extends unknown[]> = {
  key: (...opt: Args) => ResponseKeyType,
  cache: Cache,
  emitter: CacheEventEmitter,
}

export function wrapCache<This, Args extends unknown[]>(getCache: (t: This) => CacheParams<Args>) {
  let cache: CacheParams<Args> | null = null;
  function wrapped<Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
  ) {
    context.addInitializer(function (this: This) {
      process.nextTick(() => {
        cache = getCache(this);
      });
    });
    async function replacementMethod(this: This, ...args: Args) {
      if (!cache) {
        cache = getCache(this);
      }
      if (cache) {
        const { get, set } = getGetterSetter<Return>(cache.cache, cache.key.apply(this, args));
        const cacheKey = await get();
        if (cacheKey) {
          return cacheKey;
        }
        const result = await target.apply(this, args);
        await set(result);
        return result;
      }
      return await target.apply(this, args);
    }
    return replacementMethod;
  }
  return wrapped;
}
