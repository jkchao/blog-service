/*
*
* 喜欢文章
*
*/

const Article = require('../model/article.model')
const Comment = require('../model/comment.module')
// const Option = require('../model/option.model')
const {
  handleRequest,
  handleSuccess,
  handleThrottle,
  handleError
} = require('../utils/handle')

const likeCtrl = {}

likeCtrl.POST = async ctx => {
  const { _id, type } = ctx.request.body

  if (!_id || !type || ![0, 1].includes(Number(type))) {
    handleError({ ctx, message: '无效参数' })
    return false
  }

  // type=0 文章 type=1 评论
  const res = await (Number(type) === 0 ? Article : Comment)
                        .findById(_id)
                        .catch(err => ctx.throw(500, '服务器内部错误'))
  if (res) {
    if (Number(type) === 0) res.meta.likes += 1
    else res.likes += 1
    const info = await res
                      .save()
                      .catch(err => ctx.throw(500, '服务器内部错误'))
    if (info) handleSuccess({ ctx, message: '操作成功' })
    else handleError({ ctx, message: '操作失败' })
  } else handleError({ ctx, message: '操作失败' })
}

module.exports = ctx => handleRequest({ ctx, controller: likeCtrl })