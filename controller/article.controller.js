/* 
*
*  文章控制器
* 
*/

const Article = require('../model/article.model')
const Option = require('../model/option.model')
const {
  handleRequest,
  handleSuccess,
  handleThrottle,
  handleError
} = require("../utils/handle")

const artCtral = { list: {}, item: {} }

// 获取文章列表
artCtral.list.GET = async ctx => {

  const { 
    current_page = 1,
    page_size = 18,
    keyword = '',
    state = 1,
    publish = 1,
    tag,
    data } = ctx.query

	// 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(current_page),
    limit: Number(page_size)
  }

  // 参数
  const querys = {}

	// 关键词查询
	if (keyword) {
		const keywordReg = new RegExp(keyword)
		querys['$or'] = [
			{ 'title': keywordReg },
			{ 'content': keywordReg },
			{ 'description': keywordReg }
		]
	}
}

// 添加文章
artCtral.list.POST = async ctx => {
  const res = new Article(ctx.request.body)
                  .save()
                  .catch(err => handleError({ ctx, message: '服务器内部错误' }))
  if (res) handleSuccess({ ctx, message: '添加文章成功' })
  else handleError({ ctx, message: '添加文章失败' })
}

// 删除文章
artCtral.item.DELETE = async ctx => {}

// 修改文章
artCtral.item.PUT = async ctx => {}

// 修改文章状态
artCtral.item.PATCH = async ctx => {}

exports.list = ctx => handleRequest({ ctx, controller: artCtral.list })
exports.item = ctx => handleRequest({ ctx, controller: artCtral.item })