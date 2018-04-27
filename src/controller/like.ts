/*
*
* 喜欢文章
*
*/
import { Context } from 'koa'

import Article from '../model/article'
import Comment from '../model/comment'

import { handleSuccess, IParams, handleError } from '../utils/handle'

export default class LikeController {
  // 添加
  public static async postLike (ctx: Context) {
    const { _id, type } = ctx.request.body

    if (!_id || !type || ![0, 1].includes(Number(type))) {
      handleError({ ctx, message: '无效参数' })
      return false
    }

    // type=0 文章 type=1 评论
    const res = await (Number(type) === 0 ? Article : Comment)
                        .findById(_id)
    if (res) {
      if (Number(type) === 0) res.meta.likes += 1
      else res.likes += 1
      const info = await res
        .save()
        .catch((err: string) => ctx.throw(500, '服务器内部错误'))
      if (info) handleSuccess({ ctx, message: '操作成功' })
      else handleError({ ctx, message: '操作失败' })
    } else handleError({ ctx, message: '操作失败' })
  }
}