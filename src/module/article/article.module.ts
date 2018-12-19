import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './schema/article.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Articles', schema: ArticleSchema }])]
})
export class ArticleModule {}
