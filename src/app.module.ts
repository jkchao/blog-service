import { Module, CacheModule, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

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
import { Middleware } from 'subscriptions-transport-ws';
import { Request, Response } from 'express';
import { HerosModule } from './module/heros/heros.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './common/guards/AccessGuard';
import { CommentsModule } from './module/comments/comments.module';

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
        context: ({ req, res }: { req: Request; res: Response }) => ({
          request: req
        }),
        formatError: (error: GraphQLError) => {
          logger.error(
            JSON.stringify({
              message: error.message,
              location: error.locations,
              stack: error.stack ? error.stack.split('\n') : [],
              path: error.path
            })
          );
          return error;
        }
      }),
      inject: [BlogLogger]
    }),
    MongooseModule.forRoot(config.MONGO_URL),
    AuthModule,
    OptionsModule,
    QiniuModule,
    LinksModule,
    HerosModule,
    CommentsModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
    {
      provide: APP_GUARD,
      useClass: AccessGuard
    }
  ]
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes(
    //     { path: '*', method: RequestMethod.POST }
    //   );
  }
}
