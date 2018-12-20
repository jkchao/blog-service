import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './schema/articles.schema';
import { ArticlesResolver } from './articles.resolver';
import { ArticlesSercice } from './articles.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Articles', schema: ArticleSchema }])],
  providers: [ArticlesResolver, ArticlesSercice]
})
export class ArticlesModule {}
