declare module 'express-rate-limit' {
  import { RequestHandler, Request, Response } from 'express';
  namespace limit {
    interface Store {
      /**
       * Increments the value in the underlying store for the given key.
       */
      incr(key: string, cb: (err?: Error, hits?: number) => void): void;
      /**
       * Decrements the value in the underlying store for the given key.
       * Used only and must be implemented when skipFailedRequests is true.
       */
      decrement?(key: string): void;
      /**
       * Resets a value with the given key.
       */
      resetKey(key: string): void;
    }

    interface RateLimitHandler extends RequestHandler {
      /**
       * Proxy function that calls `Store.resetKey`
       */
      resetKey(key: string): void;
    }

    interface RateLimitOptions {
      /**
       * how long to keep records of requests in memory.
       * Is not used for actually checking anything if `store` is set.
       * Will be used when `headers` is enabled.
       */
      windowMs?: number;
      /**
       * how many requests to allow through before starting to delay responses
       */
      delayAfter?: number;
      /**
       * base delay applied to the response - multiplied by number of recent hits for the same key.
       */
      delayMs?: number;
      /**
       * max number of recent connections during `window` milliseconds before sending a 429 response
       */
      max?: number;
      /**
       * Message to be send on ratelimit hit.
       * Ignored if `handler` is set.
       * If request is `json`, the message will be send as `{ message: MSGOBJECT }`
       * If request is `html`, the message will not be altered.
       * Default:'Too many requests, please try again later.',
       */
      message?: string | object;
      /**
       * Status code to be send on ratelimit hit.
       * Ignored if `handler` is set.
       * Defaults to 429 (RFC)
       */
      statusCode?: number;
      /**
       * Send custom rate limit header with limit and remaining.
       * Ignored if `handler` is set.
       * Defaults to true.
       */
      headers?: boolean;
      /**
       * Do not count failed requests (status >= 400).
       * Store must implement `decrement` method for this to work.
       * Defaults to false.
       */
      skipFailedRequests?: boolean;
      /**
       * allows to create custom keys.
       * Defaults to request ip.
       */
      keyGenerator?(req: Request, res: Response): string;
      /**
       * allows to skip certain requests.
       * Defaults to skipping none.
       */
      skip?(req: Request, res: Response): boolean;
      /**
       * allows to skip certain requests.
       * Defaults to skipping none.
       */
      skip?(req: Request, res: Response): boolean;
      /**
       * Can be overriden to implement custom response behaviour.
       * See other options to see what this does.
       */
      handler?: RequestHandler;
      /**
       * Called each time the limit is reached.
       * You can use it to debug/log.
       * Defaults to doing nothing.
       */
      onLimitReached?(
        req: Request,
        res: Response,
        opts: RateLimitOptions
      ): void;

      /**
       * Store to use for ratelimiting.
       * Defaults to in memory.
       */
      store?: Store;
    }
  }
  function limit(options?: limit.RateLimitOptions): limit.RateLimitHandler;

  export = limit;
}
