import jwt from 'jsonwebtoken';
import { Injectable, Inject } from '@nestjs/common';
import { config } from '../../config';

import { Model } from 'mongoose';
import { AuthInterface } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(@Inject('AuthModelToken') private readonly authModel: Model<AuthInterface>) {}

  public createToken(params: { username: string }) {
    return jwt.sign(
      {
        ...params,
        ext: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      },
      config.JWTKEY
    );
  }

  public async findOneByUsername(username: string): Promise<AuthInterface | null> {
    return await this.authModel.findOne({ username });
  }
}
