

import config = require('../config')
import crypto = require('crypto')

import Auth from '../model/auth'

import { BaseContext } from 'koa'

// md5 编码
const md5Decode = (pwd: string | Buffer | DataView) => {
  return crypto
          .createHash('md5')
          .update(pwd)
          .digest('hex')
}

// 初始化管理员账号中间件(当然这些中间件只有用户访问改网址才会执行)
export default async (ctx: BaseContext, next: () => void) => {
  const username = config.AUTH.defaultUsername
  const password = md5Decode(config.AUTH.defaultPassword)
  // const name = config.admin.name;
  const result = await Auth
                        .find()
                        .exec()
  if (result.length === 0) {
    const user = new Auth({
                    username,
                    password
                  })
    await user
            .save()
            .catch(err => {
              ctx.throw(500, '服务器内部错误-存储admin错误！')
            })
    console.log('初始化admin账号密码完成!')
  }
  await next()
}
