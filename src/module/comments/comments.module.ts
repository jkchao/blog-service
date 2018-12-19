import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsSchema } from './schema/comments.schema';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { EmailModule } from '../common/email/email.module';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comments', schema: CommentsSchema }]), EmailModule, ArticleModule],
  providers: [CommentsResolver, CommentsService]
})
export class CommentsModule {}
