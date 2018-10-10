import { Injectable, Inject } from '@nestjs/common';

import { Model } from 'mongoose';
import { AuthInterface } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(@Inject('AuthModelToken') private readonly authModel: Model<AuthInterface>) {}

  public async findOneByUsername(username: string): Promise<AuthInterface | null> {
    return await this.authModel.findOne({ username });
  }
}
