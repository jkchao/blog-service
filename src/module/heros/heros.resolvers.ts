import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { QueryLinksDto, InfoDto } from './dto/heros.dto';
import { HerosService } from './heros.service';
import { Info } from './decorators/heros.decorators';
import { HerosHasId, HerosQuery } from './interface/heros.interface';

@Resolver()
export class HerosResolver {
  constructor(private herosService: HerosService) {}

  @Query()
  public getHeros(@Args() args: HerosQuery) {
    return this.herosService.searchHero(args);
  }

  @Mutation()
  public deleteHero(@Args('_id') _id: string) {
    return this.herosService.deleteHero(_id);
  }

  @Mutation()
  public createHero(@Info() info: InfoDto) {
    return this.herosService.createHero(info);
  }

  @Mutation()
  public updateHero(@Info() info: HerosHasId) {
    return this.herosService.updateHero(info);
  }
}
