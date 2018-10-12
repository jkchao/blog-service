import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';

import { Model } from 'mongoose';
import { AuthInterface } from './interface/auth.interface';
import { config } from '../../config';
import { md5Decode } from '../../common/utils';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AuthModelToken') private readonly authModel: Model<AuthInterface>) {
    this.initUser();
  }

  /**
   * 初始化创建用户
   */
  private async initUser() {
    const auth = this.findOneByUsername(config.DEFAULT_USERNAME);
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
  public async findOneByUsername(username: string): Promise<AuthInterface | null> {
    return await this.authModel.findOne({ username });
  }
}
