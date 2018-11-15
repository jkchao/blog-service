import { Module } from '@nestjs/common';
import { QiniuResolvers } from './qiniu.resolvers';
import { QiniuService } from './qiniu.service';

@Module({
  providers: [QiniuResolvers, QiniuService]
})
export class QiniuModule {}
