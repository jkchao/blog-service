import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';

import { Model } from 'mongoose';
import { AuthInterface } from './interface/auth.interface';
import { config } from '../../config';
import { md5Decode } from '../../common/utils';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private readonly authModel: Model<AuthInterface>) {
    this.initUser();
  }

  /**
   * 初始化创建用户
   */
  public async initUser() {
    const auth = await this.findOneByUsername(config.DEFAULT_USERNAME);
    if (!auth) {
      const password = md5Decode(config.DEFAULT_PASSWORD);

      try {
        await this.authModel.create({
          username: config.DEFAULT_USERNAME,
          password
        });
      } catch (error) {
        throw new InternalServerErrorException('初始化用户失败');
      }
    }
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   */
  public async findOneByUsername(username: string) {
    return await this.authModel.findOne({ username });
  }
}
