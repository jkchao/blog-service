import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { QueryLinksDto, InfoDto } from './dto/links.dto';
import { LinksService } from './links.service';
import { Info } from './decorators/links.decorators';
import { LinksHasId, LinksQuery } from './interface/links.interface';

@Resolver()
export class LinksResolver {
  constructor(private linksService: LinksService) {}

  @Query()
  public getLinks(@Args() args: LinksQuery) {
    return this.linksService.searchLink(args);
  }

  @Mutation()
  public deleteLink(@Args('_id') _id: string) {
    return this.linksService.deleteLink(_id);
  }

  @Mutation()
  public createLink(@Info() info: InfoDto) {
    return this.linksService.createLink(info);
  }

  @Mutation()
  public updateLink(@Info() info: LinksHasId) {
    return this.linksService.updateLink(info);
  }
}
