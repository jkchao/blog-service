import { Resolver, Query, Mutation } from '@nestjs/graphql';

@Resolver('Link')
export class LinksResolver {
  @Query()
  public createLink() {
    //
  }

  @Mutation()
  public deleteLink() {
    //
  }

  @Mutation()
  public updateLink() {
    //
  }

  @Mutation()
  public getLinks() {
    //
  }
}
