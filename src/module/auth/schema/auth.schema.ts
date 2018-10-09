import Mongoose from 'mongoose';
import { config } from '../../../config';
import crypto from 'crypto';

export const AuthSchema = new Mongoose.Schema({
  // 名字
  name: { type: String, default: '' },

  // 登录用户名
  username: {
    type: String,
    default: config.DEFAULT_USERNAME
  },

  // 签名
  slogan: { type: String, default: '' },

  // 头像
  gravatar: { type: String, default: '' },

  // 密码
  password: {
    type: String,
    default: crypto
      .createHash('md5')
      .update(config.DEFAULT_PASSWORD)
      .digest('hex')
  }
});
