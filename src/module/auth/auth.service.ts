import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { AuthMongo } from './interface/auth.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AuthInfoDto, AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private readonly authModel: Model<AuthMongo>) {}

  /**
   * 根据用户名查找用户
   * @param username 用户名
   */
  public async findOne(info?: AuthInfoDto) {
    return await this.authModel.findOne({ ...info });
  }

  /**
   * 初始化创建用户
   * @param auth { username password }
   */
  public async create(auth: AuthDto) {
    return await this.authModel.create(auth);
  }

  public async update(auth: AuthInfoDto) {
    return this.authModel.findOneAndUpdate(auth._id, auth, { new: true });
  }
}
