/*
*
* 登录控制器
*
*/

const Login = require('../model/login.model');
const config = require('../config')

const {
  handleRequest,
  handleError,
  handleSuccess,
  handleThrottle
} = require("../utils/handle");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const loginCtrl = {};

// md5 编码
const md5Decode = pwd => {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex");
};

loginCtrl.POST = async ctx => {
  const { username, password } = ctx.request.body
  console.log({username, password})
  let user = await Login.find({ username, password })
  if (user) {
    const token = jwt.sign({
      name: user.name,
      password: user.password,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    })
    handleSuccess({ res, result: { token }, message: '登陆成功' })
  }
  else handleError({ res, err, message: '来者何人!' })
};

loginCtrl.get = async ctx => {
  ctx.response.body = '111'
}

module.exports = ctx => {
  handleRequest({ req: ctx.request, res: ctx.response, controller: loginCtrl });
};
