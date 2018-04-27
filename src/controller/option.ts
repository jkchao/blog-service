/*
*
* 网站信息控制器
*
*/

import Option, { IOption } from '../model/option'

import { Context } from 'koa'
import { handleError, handleSuccess, IParams } from '../utils/handle'

export default class OptionController {

  // 获取信息
  public static async getOption (ctx: Context) {
    const option = await Option
                        .findOne()
                        .catch(err => ctx.throw(500, '服务器内部错误'))
    if (option) handleSuccess({ ctx, result: option, message: '获取配置项成功' })
    else handleError({ ctx, message: '获取配置项失败'})
  }

  // 修改信息
  public static async putOption (ctx: Context) {
    const _id = ctx.request.body._id
    const option = await (
                            _id
                            ? Option.findByIdAndUpdate(_id, ctx.request.body, { new: true })
                            : new Option(ctx.request.body).save()
                          )
                          .catch(err => ctx.throw(500, '服务器内部错误'))
    if (option) handleSuccess({ ctx, result: option._id, message: '修改配置项成功' })
    else handleError({ ctx, message: '修改配置项失败' })
  }
}
