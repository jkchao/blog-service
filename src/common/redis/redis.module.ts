import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CACHE } from './redis.constant';
import redis from 'redis';
import { BlogLogger } from '../logger/logger';
import { BlogLoggerModule } from '../logger/logger.module';

@Global()
@Module({
  imports: [BlogLoggerModule],
  providers: [
    RedisService,
    {
      provide: REDIS_CACHE,
      useValue: redis
    },
    BlogLogger
  ],
  exports: [RedisService]
})
export class RedisModule {}
