import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { AuthInterface } from './interface/auth.interface';
import { InjectModel } from '@nestjs/mongoose';
import { InfoDto, AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private readonly authModel: Model<AuthInterface>) {}

  /**
   * 根据用户名查找用户
   * @param username 用户名
   */
  public async findOne(info?: InfoDto) {
    return await this.authModel.findOne({ ...info });
  }

  /**
   * 初始化创建用户
   * @param auth { username password }
   */
  public async create(auth: AuthDto) {
    return await this.authModel.create(auth);
  }

  public async update(auth: InfoDto) {
    return this.authModel.findOneAndUpdate(auth._id, auth, { new: true });
  }
}
