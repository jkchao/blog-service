import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './schema/tags.schema';
import { TagsResolver } from './tags.resolver';
import { TagsService } from './tags.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tags', schema: TagSchema }]), ArticleModule],
  providers: [TagsResolver, TagsService]
})
export class TagModule {}
