import { Get, Controller, Headers, ServiceUnavailableException } from '@nestjs/common';

import { BaseController } from '../base/base.controller';

import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import jwt from 'jsonwebtoken';
import { UserInterface } from './interface/user.interface';

@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('getInfo')
  public async getInfo(@Headers('authorization') header: string) {
    const { userName = 'ADMIN', userEmail = 'ADMIN@VIPABC.COM' } = jwt.decode(header.split(' ')[1]) as UserInterface;
    try {
      const res = await this.userService.getUserPermission({
        userName,
        userEmail
      });
      if (res.code === 20000) return this.handleSucces(res.data);
      else return this.handleError(res.message);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
