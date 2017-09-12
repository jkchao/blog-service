/*
*
* 登录控制器
*
*/

const Auth = require("../model/auth.model")
const config = require("../config")

const {
  handleRequest,
  handleError,
  handleSuccess,
  handleThrottle
} = require("../utils/handle")

const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const authCtrl = { login: {}, user: {} }

// md5 编码
const md5Decode = pwd => {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex")
}


// 登录
authCtrl.login.POST = async ctx => {
  const { username, password } = ctx.request.body
  const auth = await Auth
              .findOne({ username })
              .catch(err => ctx.throw(500, '服务器内部错误'))
  if (auth) {
    if (auth.password === md5Decode(password)) {
      const token = jwt.sign({
        name: auth.name,
        password: auth.password,
        exp: Math.floor(Date.now() / 1000) + 60 * 60
      }, config.AUTH.jwtTokenSecret)
      handleSuccess({ ctx, result: { token, lifeTime: Math.floor(Date.now() / 1000) + 60 * 60 }, message: "登陆成功" })
    } else handleError({ ctx, message: "密码错误!" })
  } else handleError({ ctx, message: "账户不存在" })
}

// 获取用户信息
authCtrl.user.GET = async ctx => {
  const auth = await Auth
              .findOne({}, 'name username slogan gravatar')
              .catch(err => ctx.throw(500, '服务器内部错误'))
  if (auth) {
    handleSuccess({ ctx, result: auth, message: '获取用户资料成功'})    
  } else handleError({ ctx, message: "获取用户资料失败" })
}

// 修改用户信息
authCtrl.user.PUT = async ctx => {
  const { _id, name, username, slogan, gravatar, oldPassword, newPassword } = ctx.request.body
  const _auth = await Auth
                .findOne({}, '_id name slogan gravatar password')
                .catch(err => ctx.throw(500, '服务器内部错误'))
  if (_auth) {
    if (_auth.password !== md5Decode(oldPassword)) handleError({ ctx, message: "原密码错误" })
    else {
      const password = newPassword === '' ? oldPassword : newPassword
      let auth = await Auth
                      .findByIdAndUpdate(_id, { _id, name, username, slogan, gravatar, password: md5Decode(password) }, { new: true })
                      .catch(err => ctx.throw(500, '服务器内部错误'))
      if (auth) handleSuccess({ ctx, result: auth, message: '修改用户资料成功'})
      else handleError({ ctx, message: "修改用户资料失败" })
    }
  } else handleError({ ctx, message: "修改用户资料失败" })

}

exports.login = ctx => handleRequest({ ctx, controller: authCtrl.login })
exports.user = ctx => handleRequest({ ctx, controller: authCtrl.user })
