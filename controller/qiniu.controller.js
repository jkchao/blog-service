/*
*
* 七牛控制器
*
*/

const qn = require('qn')
const config = require('../config')
const { handleSuccess } = require("../utils/handle")

const client = qn.create(config.QINIU)

class QNController {
  static getQN (ctx) {
    handleSuccess({ ctx, result: { token: client.uploadToken() }, message: '获取 upToen 成功' })
  }
}

module.exports = QNController
