import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

/**
 * 解密
 * @param pwd 解密的密码
 */
export function md5Decode(pwd: string | Buffer | DataView) {
  return crypto
    .createHash('md5')
    .update(pwd)
    .digest('hex');
}

export function createToken(params: { username: string }) {
  const toekn = jwt.sign(
    {
      ...params,
      ext: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    },
    config.JWTKEY
  );
  return toekn;
}
