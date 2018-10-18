import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { AuthInterface } from './interface/auth.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private readonly authModel: Model<AuthInterface>) {}

  /**
   * 根据用户名查找用户
   * @param username 用户名
   */
  public async findOneByUsername(username: string) {
    return await this.authModel.findOne({ username });
  }
}
