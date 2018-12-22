import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LikeInfo } from './interface/like.interface';
import { BadRequestException } from '@nestjs/common';
import { LikeService } from './like.service';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation()
  public async postLike(@Args('likeInfo') likeInfo: LikeInfo) {
    if (![0, 1].includes(likeInfo.type)) {
      throw new BadRequestException('type should in [0, 1]');
    }
    await this.likeService.createLike(likeInfo);
    return { message: 'success' };
  }
}
