/* 
*
*  英雄榜控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../utils/handle')
const Heros = require('../model/heros.model')
const geoip = require('geoip-lite')

const heroCtrl = { list: {}, item: {} }

heroCtrl.list.GET = async ctx => {

  let { page = 1, curr_page = 10, keyword = '', state } = ctx.request.body

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(page),
    limit: Number(curr_page)
  }

  // 查询参数
  const querys = {
    name: new RegExp(keyword)
  }

  // 审核状态查询
  if (['0', '1', '2', '3'].includes(state)) {
    querys.state = state
  }

  // 查询
  const result = await Heros
                  .paginate(querys, options)
                  .catch(err => ctx.throw(500, '服务器内部错误'))
  console.log(result)
  handleSuccess({
    ctx,
    result: {
      pagination: {
        total: result.total,
        current_page: result.page,
        total_page: result.pages,
        per_page: result.limit
      },
      list: result.docs
    },
    message: '列表数据获取成功'
  })
}


// module.exports = ctx => handleRequest({ ctx, controller: heroCtrl })
exports.list = ctx => handleRequest({ ctx, controller: heroCtrl.list })
exports.item = ctx => handleRequest({ ctx, controller: heroCtrl.item })