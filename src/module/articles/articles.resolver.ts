import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { ArticlesSercice } from './articles.service';
import { QueryArticleDto, ArticleInfoDto } from './dto/article.dto';
import { Request } from 'express';
import { ArticleMongo } from './interface/articles.interface';

@Resolver()
export class ArticlesResolver {
  constructor(private readonly articleService: ArticlesSercice) {}

  @Query()
  public getArticleById(@Args('_id') _id: string) {
    return this.articleService.getArticleById(_id);
  }

  @Query()
  public getArticles(@Args() query: QueryArticleDto, @Context('request') request: Request) {
    const token = request.headers.authorization;
    if (!token) {
      query.state = 1;
      query.publish = 1;
    }
    return this.articleService.searchArticle(query);
  }

  @Mutation()
  public createArticle(@Args('articleInfo') info: ArticleInfoDto) {
    return this.articleService.createArticle(info);
  }

  @Mutation()
  public updateArticle(@Args('articleInfo') info: ArticleMongo) {
    return this.articleService.updateArticleWidthId(info);
  }

  @Mutation()
  public async deleteArticle(@Args('_id') _id: string) {
    await this.articleService.deleteArticle(_id);
    return { message: 'success' };
  }
}
