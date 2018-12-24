import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { LikeDto } from './dto/like.dto';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation()
  public async postLike(@Args('likeInfo') likeInfo: LikeDto) {
    await this.likeService.createLike(likeInfo);
    return { message: 'success' };
  }
}
