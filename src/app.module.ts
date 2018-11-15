import { Module, CacheModule } from '@nestjs/common';

import { HttpModule } from './common/http/http.module';
import { HttpCacheInterceptor } from './common/interceptors/httpCache.interceptor';
import { AuthModule } from './module/auth/auth.module';
import { OptionsModule } from './module/options/options.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { QiniuModule } from './module/qiniu/qiniu.module';

@Module({
  imports: [
    // CacheModule.register({
    //   max: 5,
    //   ttl: 5
    // }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: '/api/v2'
    }),
    MongooseModule.forRoot(config.MONGO_URL),
    AuthModule,
    HttpModule,
    OptionsModule,
    QiniuModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
  ]
})
export class AppModule {}
