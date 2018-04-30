/*
*
* 登录控制器
*
*/

import crypto = require('crypto')
import jwt = require('jsonwebtoken')

import { Context } from 'koa'

import config = require('../config')

import { handleSuccess, IParams, handleError } from '../utils/handle'

import Auth, { IAuth } from '../model/auth'

// md5 编码
const md5Decode = (pwd: string | Buffer | DataView) => {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex")
}

export default class AuthController {

  // 登录
  public static async login (ctx: Context) {
    const { username, password } = ctx.request.body

    const auth = (await Auth
                        .findOne({ username })) as IAuth | null
    if (auth) {
      if (auth.password === md5Decode(password)) {
        const token = jwt.sign({
          name: auth.name,
          password: auth.password,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
        }, config.AUTH.jwtTokenSecret)
        handleSuccess({ ctx, result: { token, lifeTime: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) }, message: "登陆成功" })
      } else handleError({ ctx, message: "密码错误!" })
    } else handleError({ ctx, message: "账户不存在" })
  }

  // 获取用户信息
  public static async getAuth (ctx: Context) {
    const auth = await Auth
                    .findOne({}, 'name username slogan gravatar')
                    .catch(err => ctx.throw(500, '服务器内部错误'))

    if (auth) {
      handleSuccess({ ctx, result: auth, message: '获取用户资料成功' })
    } else handleError({ ctx, message: "获取用户资料失败" })
  }

  // 修改用户信息
  public static async putAuth (ctx: Context) {

    const {
      _id,
      name,
      username,
      slogan,
      gravatar,
      oldPassword,
      newPassword
    } = ctx.request.body

    const _auth = (await Auth
                    .findOne({}, '_id name slogan gravatar password')) as IAuth | null
    if (_auth) {
      if (_auth.password !== md5Decode(oldPassword)) handleError({ ctx, message: "原密码错误" })
      else {
        const password = newPassword === '' ? oldPassword : newPassword
        const auth = await Auth
                          .findByIdAndUpdate(_id,
                            {
                              _id,
                              name,
                              username,
                              slogan,
                              gravatar,
                              password: md5Decode(password)
                            },
                            {
                              new: true
                            }
                          )
        if (auth) handleSuccess({ ctx, result: auth, message: '修改用户资料成功' })
        else handleError({ ctx, message: "修改用户资料失败" })
      }
    } else handleError({ ctx, message: "修改用户资料失败" })
  }
}
