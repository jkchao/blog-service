import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { InfoDto } from './dto/links.dto';
import { LinksService } from './links.service';
import { Info } from './decorators/links.decorators';
import { LinksHasId, LinksQuery } from './interface/links.interface';
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
  public createLink(@Info() info: InfoDto) {
    return this.linksService.createLink(info);
  }

  @Mutation()
  @Permissions()
  public updateLink(@Info() info: LinksHasId) {
    return this.linksService.updateLink(info);
  }
}
