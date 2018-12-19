import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '@/config';

@Injectable()
export class AuthMiddleware {
  private getToken(req: Request): false | string {
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (Object.is(parts.length, 2) && Object.is(parts[0], 'Bearer')) {
        return parts[1];
      }
    }
    return false;
  }

  public resolve(...args: any[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (config.ENV === 'dev') return next();

      const token = this.getToken(req);
      if (!token) {
        throw new UnauthorizedException('Authorization cannot be empty');
      }
      try {
        const decodedToken = jwt.verify(token, config.JWTKEY) as {
          ext: number;
        };
        if (decodedToken.ext > Math.floor(Date.now() / 1000)) {
          return true;
        }
      } catch (err) {
        throw new UnauthorizedException('用户信息已过期');
      }
      next();
    };
  }
}
