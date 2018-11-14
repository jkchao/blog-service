import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OptionsService } from './options.service';
import { OptionsInfo } from './interface/options.interface';
import { Info } from './decorators/options.decorators';

@Resolver('options')
export class OptionsResolver {
  constructor(private readonly optionsService: OptionsService) {}

  @Query()
  public getOptions() {
    return this.optionsService.getOptions();
  }

  @Mutation()
  public updateOptions(@Info() optionsInfo: OptionsInfo) {
    return this.optionsService.updateOptions(optionsInfo);
  }
}
