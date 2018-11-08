import { Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { md5Decode, createToken } from '../../common/utils';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthDto } from './dto/auth.dto';

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
    try {
      const auth = await this.authService.findOneByUsername(args.username);
      if (auth) {
        if (auth.password === md5Decode(args.password)) {
          const token = createToken({ username: args.username });
          return { token, lifeTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
        } else {
          throw {
            status: 401,
            message: '密码错误'
          };
        }
      } else {
        // this.handleError(res, '账号不存在');
        throw {
          status: 401,
          message: '帐号不存在'
        };
      }
    } catch (error) {
      throw new HttpException(error.message || '', error.status || 400);
    }
  }
}
