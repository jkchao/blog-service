/**
 * 响应时间拦截器
 */

import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

const logger = new Logger();

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { fieldName } = ctx.getInfo();

    const now = Date.now();
    return call$.pipe(
      tap(
        () => {
          logger.log(`${fieldName} SUCCESS ---- ${Date.now() - now}ms`);
        },
        () => {
          logger.error(`${fieldName} ERROR ---- ${Date.now() - now}ms`);
        }
      )
    );
  }
}
