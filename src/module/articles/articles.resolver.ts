import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { ArticlesSercice } from './articles.service';
import { QueryArticleDto, ArticleInfoDto } from './dto/article.dto';
import { Request } from 'express';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { Permissions } from '@/common/decorator/Permissions.decorator';

@Resolver()
export class ArticlesResolver {
  constructor(private readonly articleService: ArticlesSercice) {}

  @UseInterceptors(ClassSerializerInterceptor)
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
  @Permissions()
  public createArticle(@Args('articleInfo') info: ArticleInfoDto) {
    return this.articleService.createArticle(info);
  }

  @Mutation()
  @Permissions()
  public updateArticle(@Args('articleInfo') info: ArticleInfoDto) {
    return this.articleService.updateArticleWidthId(info);
  }

  @Mutation()
  @Permissions()
  public async deleteArticle(@Args('_id') _id: string) {
    await this.articleService.deleteArticle(_id);
    return { message: 'success' };
  }
}
