/*
*
* 喜欢文章
*
*/

const Article = require('../model/article.model')
// const Option = require('../model/option.model')
const {
  handleRequest,
  handleSuccess,
  handleThrottle,
  handleError
} = require('../utils/handle')

const likeCtrl = {}

likeCtrl.POST = async ctx => {
  const _id = ctx.request.body._id

  if (!_id) {
    handleError({ ctx, message: '无效参数' })
    return false
  }

  const article = await Article
                        .findById(_id)
  if (article) {
    article.meta.likes += 1
    const res = await article
                      .save()
                      .catch(err => ctx.throw(500, '服务器内部错误'))
    if (res) handleSuccess({ ctx, message: '喜欢文章成功' })
    else handleError({ ctx, message: '喜欢文章失败' })
  } else handleError({ ctx, message: '喜欢文章失败' })
}

module.exports = ctx => handleRequest({ ctx, controller: likeCtrl })