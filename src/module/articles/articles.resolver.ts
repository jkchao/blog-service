import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ArticlesSercice } from './articles.service';

@Resolver()
export class ArticlesResolver {
  constructor(private readonly articleService: ArticlesSercice) {}

  @Query()
  public getArticleById(@Args('_id') _id: string) {
    // ...
  }

  @Mutation()
  public getArticles() {
    // ..
  }

  @Mutation()
  public createArticle() {
    // ..
  }

  @Mutation()
  public updateArticle() {
    // ..
  }

  @Mutation()
  public deleteArticle(@Args('_id') _id: string) {
    return this.articleService.deleteArticle(_id);
  }
}
