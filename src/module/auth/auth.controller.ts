import { Controller, Get, Post, Res, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthDto } from './dto/auth.dto';

import { md5Decode, createToken } from '../../common/utils';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 登录
   * @param res RESPONSE
   * @param body BODY
   */
  @Post('login')
  public async login(@Body() body: AuthDto) {
    try {
      const auth = await this.authService.findOneByUsername(body.username);
      if (auth) {
        if (auth.password === md5Decode(body.password)) {
          const token = createToken({ username: body.username });
          return { token, lifeTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
        } else {
          // return this.handleError(res, '密码错误');
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
