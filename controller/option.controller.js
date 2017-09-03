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
  const option = await Option
                    .findOne()
                    .catch(err => ctx.throw(500, '服务器内部错误'));
  handleSuccess({ ctx, result: option, message: '获取配置项成功' })
}

optionCtrl.PUT = async ctx => {
  const _id = ctx.request.body._id
  const option = await (_id
                  ? Option.findByIdAndUpdate(_id, ctx.request.body, { new: true })
                  : new Option(ctx.request.body).save())
                  .catch(err => console.log(err));
  handleSuccess({ ctx, result: option._id, message: '修改配置项成功' })
}


module.exports = ctx => handleRequest({ ctx, controller: optionCtrl })