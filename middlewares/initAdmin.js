const config = require('../config');
const Auth = require('../model/auth.model');
const crypto = require("crypto");

// md5 编码
const md5Decode = pwd => {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex");
};

//初始化管理员账号中间件(当然这些中间件只有用户访问改网址才会执行)
module.exports = async (ctx, next) => {
    const username = config.AUTH.defaultUsername
    const password = md5Decode(config.AUTH.defaultPassword);
    // const name = config.admin.name;
    let result = await Auth
        .find()
        .exec()
        .catch(err => {
            ctx.throw(500, '服务器内部错误-查找admin错误！');
        });
    if(result.length === 0){
        let user = new Auth({
            username,
            password,
            createTime: new Date()
        });
        await user
            .save()
            .catch(err => {
                ctx.throw(500, '服务器内部错误-存储admin错误！');
            });
        console.log('初始化admin账号密码完成!');
    }
    await next();
}; 