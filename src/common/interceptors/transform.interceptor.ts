import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T = any> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  public intercept(context: ExecutionContext, call$: Observable<T>): Observable<Response<T>> {
    return call$.pipe(map(data => ({ data })));
  }
}
