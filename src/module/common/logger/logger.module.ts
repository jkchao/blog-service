import { Module } from '@nestjs/common';
import { BlogLogger } from './logger';

@Module({
  providers: [BlogLogger],
  exports: [BlogLogger]
})
export class BlogLoggerModule {}
