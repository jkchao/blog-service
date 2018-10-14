import { Module, CacheModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { HttpModule } from './common/http/http.module';
import { HttpCacheInterceptor } from './common/interceptors/httpCache.interceptor';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './module/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';

@Module({
  imports: [
    CacheModule.register({
      max: 5,
      ttl: 5
    }),
    MongooseModule.forRoot(config.MONGO_URL),
    AuthModule,
    HttpModule
    // RedisModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
  ]
})
export class AppModule {}
