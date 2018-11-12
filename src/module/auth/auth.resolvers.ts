import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { md5Decode, createToken } from '../../common/utils';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthDto, InfoDto, InfoRequredDto } from './dto/auth.dto';
import { Info } from './decorators/User';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  /**
   * 登录
   * @param res RESPONSE
   * @param body BODY
   */
  @Query()
  public async login(@Args() args: AuthDto) {
    const auth = await this.authService.findOne({ username: args.username });
    if (auth) {
      if (auth.password === md5Decode(args.password)) {
        const token = createToken({ username: args.username });
        return { token, lifeTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
      } else {
        throw new UnauthorizedException('Password wrong');
      }
    } else {
      throw new UnauthorizedException('Account does not exist');
    }
  }

  @Query()
  public async getInfo() {
    return await this.authService.findOne();
  }

  @Mutation()
  public async updateUserInfo(@Info() userInfo: InfoRequredDto) {
    const auth = await this.authService.findOne({ _id: userInfo._id });
    if (auth) {
      if (auth.password !== md5Decode(userInfo.oldPassword)) {
        throw new UnauthorizedException('Password wrong');
      }
      const password = userInfo.password || userInfo.oldPassword;
      return this.authService.update({
        ...userInfo,
        password: md5Decode(password)
      });
    } else {
      throw new NotFoundException();
    }
  }
}
