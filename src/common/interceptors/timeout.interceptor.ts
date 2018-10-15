import { Injectable, NestInterceptor, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError, never } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    return call$.pipe(
      timeout(5000),
      catchError(error => {
        if (error.name === 'TimeoutError') {
          return [throwError(new HttpException('Timeout', HttpStatus.GATEWAY_TIMEOUT))];
        }
        throw error;
      })
    );
  }
}
