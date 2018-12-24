import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { ArticlesModule } from '../articles/articles.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [ArticlesModule, CommentsModule],
  providers: [LikeResolver, LikeService]
})
export class LikeModule {}
