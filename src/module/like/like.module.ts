import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: 'Articles', schema: HerosSchema }]),
    // MongooseModule.forFeature([{ name: 'Comments', schema: HerosSchema }])
  ],
  providers: [LikeResolver, LikeService]
})
export class LikeModule {}
