import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { LinksInfoDto } from './dto/links.dto';
import { LinksService } from './links.service';
import { LinksMongo, LinksQuery } from './interface/links.interface';
import { Permissions } from '@/common/decorator/Permissions.decorator';

@Resolver()
export class LinksResolver {
  constructor(private linksService: LinksService) {}

  @Query()
  public getLinks(@Args() args: LinksQuery) {
    return this.linksService.searchLink(args);
  }

  @Mutation()
  @Permissions()
  public async deleteLink(@Args('_id') _id: string) {
    await this.linksService.deleteLink(_id);
    return { message: 'success' };
  }

  @Mutation()
  @Permissions()
  public createLink(@Args('linkInfo') info: LinksInfoDto) {
    return this.linksService.createLink(info);
  }

  @Mutation()
  @Permissions()
  public updateLink(@Args('linkInfo') info: LinksMongo) {
    return this.linksService.updateLink(info);
  }
}
