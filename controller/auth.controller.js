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

const loginCtrl = {};

// md5 编码
const md5Decode = pwd => {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex");
};

loginCtrl.POST = async ctx => {
  const { username, password } = ctx.request.body;
  console.log({ username, password });
  let user = await Auth.findOne({ username })
    .exec()
    .catch(err => handleError({ ctx, err, message: "服务器内部错误！" }));
  console.log(user);
  if (user) {
    const token = jwt.sign({
      name: user.name,
      password: user.password,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    });
    handleSuccess({ ctx, result: { token }, message: "登陆成功" });
  } else handleError({ ctx, err, message: "来者何人!" });
};

loginCtrl.GET = async ctx => {
  ctx.response.body = "111";
};

module.exports = ctx => {
  handleRequest({ ctx, controller: loginCtrl });
};
