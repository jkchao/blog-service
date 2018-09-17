import { Injectable } from '@nestjs/common';
import { UserInterface } from './user.interface';

import jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '../../common/http/http.service';
import { RedisService } from '../../common/redis/redis.service';
import { config } from '../../config';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService
  ) {}

  public createToken(user: UserInterface) {
    return jwt.sign(
      {
        ...user,
        ext: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      },
      config.JWTKEY
    );
  }

  public getUserPermission(user: UserInterface) {
    return this.httpService.post('/user/getUserPermission', user);
  }
}
