import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../config';

@Injectable()
export class AuthIsVerifiedGuard implements CanActivate {
  private getToken(req: Request): false | string {
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (Object.is(parts.length, 2) && Object.is(parts[0], 'Bearer')) {
        return parts[1];
      }
    }
    return false;
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const [request] = context.getArgs<[Request, Response]>();

    if (request.url.includes('auth')) return true;

    const token = this.getToken(request);
    if (token) {
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
    }

    return false;
  }
}
