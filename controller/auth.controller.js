/*
*
* 登录控制器
*
*/

const Auth = require("../model/auth.model");
const config = require("../config");

const {
  handleRequest,
  handleError,
  handleSuccess,
  handleThrottle
} = require("../utils/handle");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authCtrl = { login: {}, user: {} };

// md5 编码
const md5Decode = pwd => {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex");
};

authCtrl.login.POST = async ctx => {
  const { username, password } = ctx.request.body;
  const user = await Auth
              .findOne({ username })
              .catch(err => ctx.throw(500, '服务器内部错误'));
  if (user) {
    if (user.password === md5Decode(password)) {
      const token = jwt.sign({
        name: user.name,
        password: user.password,
        exp: Math.floor(Date.now() / 1000) + 60 * 60
      }, config.AUTH.jwtTokenSecret);
      handleSuccess({ ctx, result: { token, lifeTime: Math.floor(Date.now() / 1000) + 60 * 60 }, message: "登陆成功" });
    } else handleError({ ctx, message: "密码错误!" });
  } else handleError({ ctx, message: "来者何人!" });
};

authCtrl.user.GET = async ctx => {
  const user = await Auth
              .findOne({}, 'name username slogan gravatar')
              .catch(err => ctx.throw(500, '服务器内部错误'));
  handleSuccess({ ctx, result: user, message: '获取用户资料成功'})
}

exports.login = ctx => handleRequest({ ctx, controller: authCtrl.login });
exports.user = ctx => handleRequest({ ctx, controller: authCtrl.user });
