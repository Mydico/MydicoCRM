import { Connection, QueryRunner } from 'typeorm';
import { QueryResultCache } from 'typeorm/cache/QueryResultCache';
import { QueryResultCacheOptions } from 'typeorm/cache/QueryResultCacheOptions';
import { PlatformTools } from 'typeorm/platform/PlatformTools';

/**
 * Caches query result into Redis database.
 */
export class RedisQueryResultCache implements QueryResultCache {
  // -------------------------------------------------------------------------
  // Protected Properties
  // -------------------------------------------------------------------------

  /**
   * Redis module instance loaded dynamically.
   */
  protected redis: any;

  /**
   * Connected redis client.
   */
  protected client: any;

  /**
   * Type of the Redis Client (redis or ioredis).
   */
  protected clientType: 'redis' | 'ioredis' | 'ioredis/cluster';

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(protected connection: Connection, clientType: 'redis' | 'ioredis' | 'ioredis/cluster') {
    this.clientType = clientType;
    this.redis = this.loadRedis();
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Creates a connection with given cache provider.
   */

  async connect(): Promise<void> {
    const cacheOptions: any = this.connection.options.cache;
    if (this.clientType === 'redis') {
      if (cacheOptions && cacheOptions.options) {
        this.client = this.redis.createClient(cacheOptions.options);
      } else {
        this.client = this.redis.createClient();
      }
    } else if (this.clientType === 'ioredis') {
      if (cacheOptions && cacheOptions.port) {
        if (cacheOptions.options) {
          this.client = new this.redis(cacheOptions.port, cacheOptions.options);
        } else {
          this.client = new this.redis(cacheOptions.port);
        }
      } else if (cacheOptions && cacheOptions.options) {
        this.client = new this.redis(cacheOptions.options);
      } else {
        this.client = new this.redis();
      }
    } else if (this.clientType === 'ioredis/cluster') {
      if (cacheOptions && cacheOptions.options && Array.isArray(cacheOptions.options)) {
        this.client = new this.redis.Cluster(cacheOptions.options);
      } else if (cacheOptions && cacheOptions.options && cacheOptions.options.startupNodes) {
        this.client = new this.redis.Cluster(cacheOptions.options.startupNodes, cacheOptions.options.options);
      } else {
        throw new Error(`options.startupNodes required for ${this.clientType}.`);
      }
    }
  }

  /**
   * Disconnects the connection
   */
  async disconnect(): Promise<void> {
    return new Promise<void>((ok, fail) => {
      this.client.quit((err: any, result: any) => {
        if (err) return fail(err);
        ok();
        this.client = undefined;
      });
    });
  }

  /**
   * Creates table for storing cache if it does not exist yet.
   */
  async synchronize(queryRunner: QueryRunner): Promise<void> {}

  /**
   * Caches given query result.
   * Returns cache result if found.
   * Returns undefined if result is not cached.
   */
  getFromCache(options: QueryResultCacheOptions, queryRunner?: QueryRunner): Promise<QueryResultCacheOptions | undefined> {
    return new Promise<QueryResultCacheOptions | undefined>((ok, fail) => {
      if (options.identifier) {
        this.client.get(options.identifier, (err: any, result: any) => {
          if (err) return fail(err);
          ok(JSON.parse(result));
        });
      } else if (options.query) {
        this.client.get(options.query, (err: any, result: any) => {
          if (err) return fail(err);
          ok(JSON.parse(result));
        });
      } else {
        ok(undefined);
      }
    });
  }

  /**
   * Checks if cache is expired or not.
   */
  isExpired(savedCache: QueryResultCacheOptions): boolean {
    return savedCache.time! + savedCache.duration < new Date().getTime();
  }

  /**
   * Stores given query result in the cache.
   */
  async storeInCache(options: QueryResultCacheOptions, savedCache: QueryResultCacheOptions, queryRunner?: QueryRunner): Promise<void> {
    return new Promise<void>((ok, fail) => {
      if (options.identifier) {
        this.client.set(options.identifier, JSON.stringify(options), 'PX', options.duration, (err: any, result: any) => {
          if (err) return fail(err);
          ok();
        });
      } else if (options.query) {
        this.client.set(options.query, JSON.stringify(options), 'PX', options.duration, (err: any, result: any) => {
          if (err) return fail(err);
          ok();
        });
      }
    });
  }

  /**
   * Clears everything stored in the cache.
   */
  async clear(queryRunner?: QueryRunner): Promise<void> {
    return new Promise<void>((ok, fail) => {
      this.client.flushdb((err: any, result: any) => {
        if (err) return fail(err);
        ok();
      });
    });
  }

  /**
   * Removes all cached results by given identifiers from cache.
   */
  async remove(identifiers: string[], queryRunner?: QueryRunner): Promise<void> {
    if (identifiers) {
      identifiers.map(identifier => {
        const stream = this.client.scanStream({ match: `*${identifier}*`, count: 100 });
        let pipeline = this.client.pipeline();
        let localKeys = [];
        stream.on('data', function(resultKeys) {
          for (let i = 0; i < resultKeys.length; i++) {
            localKeys.push(resultKeys[i]);
            pipeline.del(resultKeys[i]);
          }
          if (localKeys.length > 100) {
            pipeline.exec(() => {
              console.log('one batch delete complete');
            });
            localKeys = [];
            pipeline = this.client.pipeline();
          }
        });
        stream.on('end', function() {
          pipeline.exec(() => {
            console.log('final batch delete complete');
          });
        });
        stream.on('error', function(err) {
          console.log('error', err);
        });
      });
    }

    return Promise.resolve();
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Removes a single key from redis database.
   */
  protected deleteKey(key: string): Promise<void> {
    return new Promise<void>((ok, fail) => {
      this.client.del(key, (err: any, result: any) => {
        if (err) return fail(err);
        ok();
      });
    });
  }

  /**
   * Loads redis dependency.
   */
  protected loadRedis(): any {
    try {
      if (this.clientType === 'ioredis/cluster') {
        return PlatformTools.load('ioredis');
      } else {
        return PlatformTools.load(this.clientType);
      }
    } catch (e) {
      throw new Error(`Cannot use cache because ${this.clientType} is not installed. Please run "npm i ${this.clientType} --save".`);
    }
  }
}
