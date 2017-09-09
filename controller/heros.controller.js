/* 
*
*  英雄榜控制器
*
*/

const { handleRequest, handleSuccess,  handleError } = require('../utils/handle')
const Heros = require('../model/heros.model')
const geoip = require('geoip-lite')
const authIsVerified = require('../utils/auth')

const heroCtrl = { list:{}, item: {} }

// 获取列表
heroCtrl.list.GET = async ctx => {

  let { current_page = 1, page_size = 10, keyword = '', state = '' } = ctx.query

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(current_page),
    limit: Number(page_size)
  }

  // 查询参数
  const querys = {
    name: new RegExp(keyword)
  }

  // 审核状态查询
  if (['0', '1', '2'].includes(state)) {
    querys.state = Number(state)
  }

  // 前台请求， 重置状态
  if (!authIsVerified(ctx.request)) {
    querys.state = 1
  }
  // 查询
  const result = await Heros
                  .paginate(querys, options)
                  .catch(err => ctx.throw(500, '服务器内部错误'))
  if (result) {
    handleSuccess({
      ctx,
      result: {
        pagination: {
          total: result.total,
          current_page: result.page,
          total_page: result.pages,
          page_size: result.limit
        },
        list: result.docs
      },
      message: '列表数据获取成功!'
    })
  } else handleError({ ctx, message: '获取列表数据失败'})
}

// 修改状态
heroCtrl.list.PATCH = async ctx => {
  const { state, _id } = ctx.request.body

  if (!state) {
    ctx.throw(401, '参数无效')
    return false
  }

  let res = Heros
            .update({ _id }, { state })
            .catch(err => ctx.throw(500, err))

  if (res) handleSuccess({ ctx, message: '修改状态成功!' })
  else handleError({ ctx, message: '修改状态失败'})
}

// 删除
heroCtrl.item.DELETE = async ctx => {
  const _id = ctx.params.id

  if (!_id) {
    handleError({ ctx, message: '无效参数'})
    return false
  }

  let res = Heros
            .findByIdAndRemove({ _id })
            .catch(() => ctx.throw(500, err))
  if (res) handleSuccess({ ctx, message: '删除成功' })
  else handleError({ ctx, message: '删除数据失败'})
}
// module.exports = ctx => handleRequest({ ctx, controller: heroCtrl })
exports.list = ctx => handleRequest({ ctx, controller: heroCtrl.list })
exports.item = ctx => handleRequest({ ctx, controller: heroCtrl.item })