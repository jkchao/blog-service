import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './schema/articles.schema';
import { ArticlesResolver } from './articles.resolver';
import { ArticlesSercice } from './articles.service';
import { BlogLoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Articles', schema: ArticleSchema }]), HttpModule, BlogLoggerModule],
  providers: [ArticlesResolver, ArticlesSercice],
  exports: [ArticlesSercice]
})
export class ArticlesModule {}
