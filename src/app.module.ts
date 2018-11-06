import { Module, CacheModule } from '@nestjs/common';

import { HttpModule } from './common/http/http.module';
import { HttpCacheInterceptor } from './common/interceptors/httpCache.interceptor';
import { AuthModule } from './module/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    CacheModule.register({
      max: 5,
      ttl: 5
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql']
    }),
    MongooseModule.forRoot(config.MONGO_URL),
    AuthModule,
    HttpModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
  ]
})
export class AppModule {}
