import { Module, CacheModule } from '@nestjs/common';

import { HttpModule } from './module/common/http/http.module';
import { HttpCacheInterceptor } from './common/interceptors/httpCache.interceptor';
import { AuthModule } from './module/auth/auth.module';
import { OptionsModule } from './module/options/options.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { QiniuModule } from './module/qiniu/qiniu.module';
import { BlogLoggerModule } from './module/common/logger/logger.module';
import { BlogLogger } from './module/common/logger/logger';
import { LinkModule } from './module/link/link.module';

@Module({
  imports: [
    CacheModule.register({
      max: 5,
      ttl: 5
    }),
    GraphQLModule.forRootAsync({
      imports: [BlogLoggerModule],
      useFactory: async (logger: BlogLogger) => ({
        typePaths: ['./**/*.graphql'],
        path: '/api/v2',
        formatError: (error: Error) => {
          logger.error(JSON.stringify(error));
          return error;
        }
      })
    }),
    MongooseModule.forRoot(config.MONGO_URL),
    AuthModule,
    HttpModule,
    OptionsModule,
    QiniuModule,
    BlogLoggerModule,
    LinkModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
  ]
})
export class AppModule {}
