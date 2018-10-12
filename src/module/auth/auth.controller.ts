import { Controller, Get, Post, Res, Body, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthDto } from './dto/auth.dto';

import { BaseController } from '../base/base.controller';
import { md5Decode, createToken } from '../../common/utils';
import { config } from '../../config';
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  public async login(@Res() res: Response, @Body() body: AuthDto) {
    try {
      const auth = await this.authService.findOneByUsername(body.username);
      if (auth) {
        if (auth.password === md5Decode(body.password)) {
          const token = createToken({ username: body.username });
          this.handleSucces(res, { token, lifeTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 });
        } else {
          return this.handleError(res, '密码错误');
        }
      } else {
        this.handleError(res, '用户不存在');
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
