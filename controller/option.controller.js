/*
*
* 网站信息控制器
*
*/

const Option = require('../model/option.model');
const {
  handleRequest,
  handleError,
  handleSuccess,
  handleThrottle
} = require("../utils/handle");

const optionCtrl = {}

optionCtrl.GET = async ctx => {
  const options = await Option
                    .findOne()
                    .catch(err => ctx.throw(500, '服务器内部错误'));
  console.log(options)
  handleSuccess({ ctx, result: options, message: '获取配置项成功' })
}

optionCtrl.PUT = async ctx => {
  const _id = ctx.request.id
  Option.findByIdAndUpdate
}


module.exports = ctx => handleRequest({ ctx, controller: optionCtrl })