import { CacheInterceptor, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { BlogLogger } from '../logger/logger';

const logger = new Logger();

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  // constructor(
  //   private readonly logger: BlogLogger
  // ) {
  //   super();
  // }
  public trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    if (this.httpServer.getRequestMethod && this.httpServer.getRequestUrl) {
      const isGetRequest = this.httpServer.getRequestMethod(request);
      const excludePaths: string[] = [];
      if (!isGetRequest || (isGetRequest && excludePaths.includes(this.httpServer.getRequestUrl(request)))) {
        return undefined;
      }

      logger.log('Url Cached: ' + this.httpServer.getRequestUrl(request));
      return this.httpServer.getRequestUrl(request);
    }
    return undefined;
  }
}
