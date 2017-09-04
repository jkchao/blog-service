/*
*
* 七牛控制器
*
*/

const qn = require('qn')
const config = require('../config')
const { handleRequest, handleSuccess } = require("../utils/handle")

const client = qn.create(config.QINIU)

const qiniuCtrl = {}

qiniuCtrl.GET = async ctx => {
  handleSuccess({ ctx, result: { token: client.uploadToken() }, message: '获取 upToen 成功' })
}

module.exports = ctx => handleRequest({ ctx, controller: qiniuCtrl })

