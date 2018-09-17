import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CACHE } from './redis.constant';
import redis from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_CACHE,
      useValue: redis
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
