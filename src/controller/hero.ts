/*
*
*  留言墙控制器
*
*/

import { handleSuccess, IParams, handleError } from '../utils/handle'
import Heros from '../model/heros'
import geoip from 'geoip-lite'
import { sendMail } from '../utils/email'
import { BaseContext } from 'koa'

import authIsVerified from '../utils/auth'

export default class HerosController {

  // 获取留言墙列表
  public static async getHeros (ctx: BaseContext) {

    const {
      current_page = 1,
      page_size = 12,
      keyword = '',
      state = ''
    } = ctx.query

    // 过滤条件
    const options = {
      sort: { _id: +1 },
      page: Number(current_page),
      limit: Number(page_size)
    }

    // 查询参数
    const querys: {
      name: RegExp,
      state?: number
    } = {
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

  // 修改留言墙状态
  public static async patchHero (ctx: BaseContext) {
    const { state, _id } = ctx.request.body

    if (!state) {
      ctx.throw(401, '参数无效')
      return false
    }

    const res = await Heros
                    .update({ _id }, { state })
                    .catch(err => ctx.throw(500, '服务器内部错误'))

    if (res) handleSuccess({ ctx, message: '修改状态成功!' })
    else handleError({ ctx, message: '修改状态失败'})
  }

  // 删除留言墙
  public static async deleteHero (ctx: BaseContext) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({ ctx, message: '无效参数'})
      return false
    }

    const res = await Heros
              .findByIdAndRemove(_id)
              .catch(err => ctx.throw(500, '服务器内部错误'))
    if (res) handleSuccess({ ctx, message: '删除数据成功' })
    else handleError({ ctx, message: '删除数据失败'})
  }

  // 发布留言墙
  public static async postHero (ctx: BaseContext) {
    const { body: hero } = ctx.request

    // 获取ip地址以及物理地理地址
    const ip = (ctx.req.headers['x-forwarded-for'] ||
    ctx.req.headers['x-real-ip'] ||
    ctx.req.connection.remoteAddress ||
    ctx.req.socket.remoteAddress ||
    ctx.req.connection.socket.remoteAddress ||
    ctx.req.ip ||
    ctx.req.ips[0]).replace('::ffff:', '')

    hero.state = 0
    hero.ip = ip
    hero.agent = ctx.headers['user-agent'] || hero.agent

    const ipLocation = geoip.lookup(ip)

    if (ipLocation) {
        hero.city = ipLocation.city,
        hero.range = ipLocation.range,
        hero.country = ipLocation.country
    }

    const res = new Heros(hero)
                    .save()
                    .catch(err => ctx.throw(500, '服务器内部错误'))
    if (res) {
      handleSuccess({ ctx, message: '数据提交审核成功，请耐心等待'})
      sendMail({
        to: 'jkchao@foxmail.com',
        subject: '博客有新的留言墙',
        text: `来自 ${hero.name} 的留言：${hero.content}`,
        html: `<p> 来自 ${hero.name} 的留言：${hero.content}</p>`
      })
    } else handleError({ ctx, message: '提交数据失败' })
  }
}
