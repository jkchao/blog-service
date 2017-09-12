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
} = require('../utils/handle')

const authIsVerified = require('../utils/auth')


const artCtral = { list: {}, item: {} }

// 获取文章列表
artCtral.list.GET = async ctx => {

  const {
    current_page = 1,
    page_size = 10,
    keyword = '',
    state = 1,
    publish = 1,
    tag,
    type,
    date } = ctx.query

	// 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(current_page),
    limit: Number(page_size),
    populate: ['tag']
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

	// 按照state查询
	if (['1', '2'].includes(state)) {
		querys.state = state
	}

	// 按照公开程度查询
	if (['1', '2'].includes(publish)) {
		querys.publish = publish
  }

	// 按照公开程度查询
	if (['1', '2'].includes(type)) {
		querys.type = type
  }

  // 时间查询
	if (date) {
		const getDate = new Date(date)
		if(!Object.is(getDate.toString(), 'Invalid Date')) {
			querys.create_at = {
				"$gte": new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
				"$lt": new Date((getDate / 1000 + 60 * 60 * 16) * 1000)
			}
		}
	}
  
  if (tag) querys.tag = tag

	// 如果是前台请求，则重置公开状态和发布状态
	if (!authIsVerified(ctx.request)) {
		querys.state = 1
		querys.public = 1
	}
  
  // 查询
  const result = await Article
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

// 添加文章
artCtral.list.POST = async ctx => {
  const res = new Article(ctx.request.body)
                  .save()
                  .catch(err => ctx.throw(500, '服务器内部错误'))
  if (res) handleSuccess({ ctx, message: '添加文章成功' })
  else handleError({ ctx, message: '添加文章失败' })
}

// 根据文章id 获取内容
artCtral.item.GET = async ctx => {}

// 删除文章
artCtral.item.DELETE = async ctx => {
  const _id = ctx.params.id

  if (!_id) handleError({ ctx, message: '无效参数' })

  const res = await Article
                    .findByIdAndRemove(_id)
                    .catch(err => ctx.throw(500, '服务器内部错误'))
  if (res) handleSuccess({ ctx, message: '删除文章成功' })
  else handleError({ ctx, message: '删除文章失败' })
}

// 修改文章
artCtral.item.PUT = async ctx => {}

// 修改文章状态
artCtral.item.PATCH = async ctx => {

  const _id = ctx.params.id

  const { state, publish } = ctx.request.body

  const querys = {}

  if (state) querys.state = state

  if (publish) querys.publish = publish
  
  if (!_id) {
    handleError({ ctx, message: '无效参数'})
    return false
  }

  const res = await Article
                    .findByIdAndUpdate(_id, querys)
                    .catch(err => ctx.throw(500, '服务器内部错误'))
  if (res) handleSuccess({ ctx, message: '更新文章状态成功'})
  else handleError({ ctx, message: '更新文章状态失败' })
}

exports.list = ctx => handleRequest({ ctx, controller: artCtral.list })
exports.item = ctx => handleRequest({ ctx, controller: artCtral.item })