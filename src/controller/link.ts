/*
*
* 友链控制器
*
*/

import { Context } from 'koa'

import Link from '../model/links'
import config = require('../config')
import { handleSuccess, IParams, handleError } from '../utils/handle'

export default class LinkController {

  // 获取列表
  public static async getLinks (ctx: Context) {
    const { current_page = 1, page_size = 18, keyword = '', state = '' } = ctx.query

    // 过滤条件
    const options = {
      sort: { id: 1 },
      page: Number(current_page),
      limit: Number(page_size)
    }

    // 参数
    const querys: {
      name: RegExp
      state?: number
    } = {
      name: new RegExp(keyword)
    }

    // 按照 state 查询
    if (['1', '2'].includes(state)) {
      querys.state = state
    }

    const link = await Link
                    .paginate(querys, options)
                    .catch(err => ctx.throw(500, '服务器内部错误'))
    if (link) {
      handleSuccess({
        ctx,
        result: {
          pagination: {
            total: link.total,
            current_page: link.page,
            total_page: link.pages,
            page_size: link.limit
          },
          list: link.docs
        },
        message: '列表数据获取成功!'
      })
    } else handleError({ ctx, message: '获取链接列表失败' })
  }

  // 添加链接
  public static async postLink (ctx: Context) {
    const { name, url } = ctx.request.body

    const link = await new Link({ name, url })
      .save()
      .catch(err => handleError({ ctx, message: '服务器内部错误' }))
    if (link) handleSuccess({ ctx, message: '发布链接成功', result: link })
    else handleError({ ctx, message: '发布链接失败' })
  }

  // 修改链接状态
  public static async patchLink (ctx: Context) {
    const _id = ctx.params.id

    const { state } = ctx.request.body

    const querys: { state?: number} = {}

    if (state) querys.state = state

    if (!_id) {
      handleError({ ctx, message: '无效参数' })
      return false
    }

    const res = await Link
      .findByIdAndUpdate(_id, querys)
      .catch(err => ctx.throw(500, '服务器内部错误'))
    if (res) handleSuccess({ ctx, message: '更新数据状态成功' })
    else handleError({ ctx, message: '更新数据状态失败' })
  }

  // 修改链接
  public static async putLink (ctx: Context) {
    const _id = ctx.params.id

    const { name, url } = ctx.request.body

    if (!_id) {
      handleError({ ctx, message: '无效参数' })
      return false
    }

    const res = await Link
                  .findByIdAndUpdate(_id, { name, url }, { new: true })
                  .catch(err => ctx.throw(500, '服务器内部错误'))
    if (res) handleSuccess({ ctx, message: '修改数据成功' })
    else handleError({ ctx, message: '修改数据失败' })
  }

  // 删除链接
  public static async deleteLink (ctx: Context) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({ ctx, message: '无效参数' })
      return false
    }

    const res = await Link
              .findByIdAndRemove(_id)
              .catch(err => ctx.throw(500, '服务器内部错误'))
    if (res) handleSuccess({ ctx, message: '删除数据成功' })
    else handleError({ ctx, message: '删除数据失败' })
  }
}
