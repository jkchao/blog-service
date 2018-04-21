/*
*
* 权限和用户数据模型
*
*/

import * as crypto from 'crypto'

import { db } from '../mongodb'
import * as config from '../config'

export interface IAuth {
  // 名字
  name: string,

  // 用户名
  username: string,

  // 签名
  slogan: string,

  // 头像
  gravatar: string,

  // 密码
  password: string
}

const authSchema = new db.Schema({

  // 名字
  name: { type: String, default: '' },

  username: {
    type: String,
    default: config.AUTH.defaultUsername
  },

  // 签名
  slogan: { type: String, default: '' },

  // 头像
  gravatar: { type: String, default: '' },

  // 密码
  password: {
    type: String,
    default: crypto.createHash('md5').update(config.AUTH.defaultPassword).digest('hex')
  }
})

const Auth = db.model('Auth', authSchema)

export default Auth
