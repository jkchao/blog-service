import { Module, CacheModule } from '@nestjs/common';

import { HttpModule } from './module/common/http/http.module';
import { HttpCacheInterceptor } from './common/interceptors/httpCache.interceptor';
import { AuthModule } from './module/auth/auth.module';
import { OptionsModule } from './module/options/options.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { GraphQLModule } from '@nestjs/graphql';
import { QiniuModule } from './module/qiniu/qiniu.module';
import { BlogLoggerModule } from './module/common/logger/logger.module';
import { BlogLogger } from './module/common/logger/logger';
import { GraphQLError } from 'graphql';
import { LinksModule } from './module/links/links.module';
import Mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

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
        formatError: (error: GraphQLError) => {
          logger.error(
            JSON.stringify({
              message: error.message,
              location: error.locations,
              path: error.path
            })
          );
          return {
            message: error.message,
            location: error.locations
          };
        }
      }),
      inject: [BlogLogger]
    }),
    MongooseModule.forRoot(config.MONGO_URL),
    AuthModule,
    OptionsModule,
    QiniuModule,
    LinksModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
  ]
})
export class AppModule {}
