/*
*
* 网易云热评控制器
*
*/

const HotReview = require('../model/hotReview.model')

const {
  handleRequest,
  handleSuccess,
	handleThrottle,
	handleError
} = require("../utils/handle")

const authIsVerified = require('../utils/auth')
const hotReviewCtrl = { list: {}, item: {} }

// 增加热评
hotReviewCtrl.list.POST = async ctx => {

	const { auth, content } = ctx.request.body

	const hotReview = await new HotReview({ auth, content })
										.save()
										.catch(err => handleError({ ctx, message: '服务器内部错误' }))
	if (hotReview) handleSuccess({ ctx, message: '发布标签成功', result: hotReview })
	else handleError({ ctx, message: '发布热评失败' })
}

// 获取热评
hotReviewCtrl.list.GET = async ctx => {
	const { current_page = 1, page_size = 18, keyword = '' } = ctx.query

	// 过滤条件
  const options = {
    sort: { sort: 1 },
    page: Number(current_page),
    limit: Number(page_size)
	}

	// 参数
	const querys = {
		content: new RegExp(keyword)
	}

	const hotReview = await HotReview
                    .paginate(querys, options)
                    .catch(err => ctx.throw(500, '服务器内部错误'))
	if (hotReview) {

			handleSuccess({
				ctx,
				result: {
					pagination: {
						total: hotReview.total,
						current_page: hotReview.page,
						total_page: hotReview.pages,
						page_size: hotReview.limit
					},
					list: hotReview.docs
				},
				message: '列表数据获取成功!'
			})
	} else handleError({ ctx, message: '获取热评列表失败' })
}

// 删除热评
hotReviewCtrl.item.DELETE = async ctx => {
	const _id = ctx.params.id
	
	if (!_id) {
		handleError({ ctx, message: '无效参数'})
		return false
	}

	let res = await HotReview
									.findByIdAndRemove(_id)
									.catch(err => ctx.throw(500, '服务器内部错误'))
	if (res) handleSuccess({ ctx, message: '删除数据成功' })
	else handleError({ ctx, message: '删除数据失败'})
}

// 排序
hotReviewCtrl.list.PATCH = async ctx => {
	
    const { ids } = ctx.request.body
  
	
		try {
			for (let i = 0; i < ids.length; i++) {
				await HotReview
              .findByIdAndUpdate(ids[i], { sort: i + 1 })
              .catch(err => ctx.throw(500, '服务器内部错误'))
			}
			handleSuccess({ ctx, message: '排序成功' })
		} catch (error) {
			console.log(error)
			handleError({ ctx, message: '排序失败' })
		}
	}

// 修改热评
hotReviewCtrl.item.PUT = async ctx => {

	const _id = ctx.params.id

	const { auth, content } = ctx.request.body

	if (!_id) {
		handleError({ ctx, message: '无效参数'})
		return false
	}

	const res = await HotReview
										.findByIdAndUpdate(_id, { auth, content }, { new: true })
										.catch(err => ctx.throw(500, '服务器内部错误'))
	if (res) handleSuccess({ ctx, message: '修改热评成功' })
	else handleError({ ctx, message: '修改热评失败' })
}



exports.list = ctx => handleRequest({ ctx, controller: hotReviewCtrl.list })
exports.item = ctx => handleRequest({ ctx, controller: hotReviewCtrl.item })
