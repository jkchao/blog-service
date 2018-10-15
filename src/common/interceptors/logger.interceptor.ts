/**
 * 响应时间拦截器
 */

import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const logger = new Logger();

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const [request] = context.getArgs<[Request, Response]>();

    const now = Date.now();
    return call$.pipe(
      tap(
        () => {
          logger.log(`${request.method} ${request.url} SUCCESS ---- ${Date.now() - now}ms`);
        },
        () => {
          logger.error(`${request.method} ${request.url} ERROR ---- ${Date.now() - now}ms`);
        }
      )
    );
  }
}
