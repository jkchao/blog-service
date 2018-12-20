import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Info } from './decorators/tags.decorators';
import { CreateTagDto, TagInfoDto, QueryTagsDto } from './dto/tag.dto';
import { Request } from 'express';

@Resolver()
export class TagsResolver {
  constructor(private readonly tagService: TagsService) {}

  @Query()
  public async getTags(@Args() query: QueryTagsDto, @Context('request') request: Request) {
    const token = request.headers.authorization;
    let isAuth = true;
    if (!token) {
      isAuth = false;
    }
    return this.tagService.searchTags(query, isAuth);
  }

  @Mutation()
  public createTag(@Info() info: CreateTagDto) {
    return this.tagService.createTag(info);
  }

  @Mutation()
  public updateTag(@Info() info: TagInfoDto) {
    return this.tagService.updateTag(info);
  }

  @Mutation()
  public async sortTag(@Args('ids') ids: string[]) {
    await this.tagService.sortTag(ids);
    return { message: 'success' };
    // ..
  }

  @Mutation()
  public async deleteTag(@Args('_id') _id: string) {
    await this.tagService.deleteTag(_id);
    return { message: 'success' };
  }
}
