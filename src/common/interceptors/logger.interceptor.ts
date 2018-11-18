/**
 * 响应时间拦截器
 */

import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BlogLogger } from '../../module/common/logger/logger';

// const logger = new Logger();

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: BlogLogger) {}
  public intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { fieldName } = ctx.getInfo();

    const now = Date.now();
    return call$.pipe(
      tap(
        () => {
          this.logger.log(`${fieldName} SUCCESS ---- ${Date.now() - now}ms`);
        },
        () => {
          this.logger.error(`${fieldName} ERROR ---- ${Date.now() - now}ms`);
        }
      )
    );
  }
}
