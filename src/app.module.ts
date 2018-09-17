import { Module, CacheModule } from '@nestjs/common';

import { APP_INTERCEPTOR } from '@nestjs/core';

import { UserModel } from './module/user/user.module';

import { HttpModule } from './common/http/http.module';
import { HttpCacheInterceptor } from './common/interceptors/httpCache.interceptor';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    CacheModule.register({
      max: 5,
      ttl: 5
    }),
    UserModel,
    HttpModule,
    RedisModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
  ]
})
export class AppModule {}
