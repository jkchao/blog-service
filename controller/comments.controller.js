/*
*
* 评论控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../utils/handle')
const { sendMail } = require('../utils/email')
const authIsVerified = require('../utils/auth')
const Comment = require('../model/comment.module')
const Article = require('../model/article.model')
const commentCtrl = { list: {}, item: {} }

// 更新当前所受影响的文章的评论聚合数据
const updateArticleCommentCount = (post_ids = []) => {
	post_ids = [...new Set(post_ids)].filter(id => !!id);
	if (post_ids.length) {
		Comment.aggregate([
			{ $match: { state: 1, post_id: { $in: post_ids }}},
			{ $group: { _id: "$post_id", num_tutorial: { $sum : 1 }}}
		])
		.then(counts => {
			if (counts.length === 0) {
				Article.update({ id: post_ids[0] }, { $set: { 'meta.comments': 0 }})
				.then(info => {})
				.catch(err => {});
			} else {
				counts.forEach(count => {
					Article.update({ id: count._id }, { $set: { 'meta.comments': count.num_tutorial }})
					.then(info => {
						// console.log('评论聚合更新成功', info);
					})
					.catch(err => {
						// console.warn('评论聚合更新失败', err);
					});
				});
			}
		})
		.catch(err => {
			console.warn('更新评论count聚合数据前，查询失败', err);
		})
	}
};

// 邮件通知网站主及目标对象
const sendMailToAdminAndTargetUser = (comment, permalink) => {
	sendMail({
		to: '419027396@qq.com',
		subject: '博客有新的留言',
		text: `来自 ${comment.author.name} 的留言：${comment.content}`,
		html: `<p> 来自 ${comment.author.name} 的留言：${comment.content}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
	});
	if (!!comment.pid) {
		Comment.findOne({ id: comment.pid }).then(parentComment => {
			sendMail({
				to: parentComment.author.email,
				subject: '你在jkchao.cn有新的评论回复',
				text: `来自 ${comment.author.name} 的评论回复：${comment.content}`,
				html: `<p> 来自${comment.author.name} 的评论回复：${comment.content}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
			});
		})
	};
};

// 获取评论列表
commentCtrl.list.GET = async ctx => {

	let { sort = -1, current_page = 1, page_size = 88, keyword = '', post_id, state } = ctx.query

	sort = Number(sort)

	// 过滤条件
	const options = {
		sort: { _id: sort },
		page: Number(current_page),
		limit: Number(page_size)
	}

	// 排序字段
	if ([1, -1].includes(sort)) {
		options.sort = { _id: sort }
	} else if (Object.is(sort, 2)) {
		options.sort = { likes: -1 }
	};

	// 查询参数
	let querys = {}

	// 查询各种状态
	if (state && [0, 1, 2].includes(state)) {
		querys.state = state;
	};

	// 如果是前台请求，则重置公开状态和发布状态
	if (!authIsVerified(ctx.request)) {
		querys.state = 1
	};

	// 关键词查询
	if (keyword) {
		const keywordReg = new RegExp(keyword);
		querys['$or'] = [
			{ 'content': keywordReg },
			{ 'author.name': keywordReg },
			{ 'author.email': keywordReg }
		]
	}

	// 通过post-id过滤
	if (!Object.is(post_id, undefined)) {
		querys.post_id = post_id
	}

	// 请求评论
	const comments = await Comment
												.paginate(querys, options)
												.catch(err => ctx.throw(500, '服务器内部错误'))
	if (comments) {
		handleSuccess({
			ctx,
			message: "评论列表获取成功",
			result: {
				pagination: {
					total: comments.total,
					current_page: options.page,
					total_page: comments.pages,
					per_page: options.limit
				},
				data: comments.docs
			}
		})
	} else handleError({ ctx, message: "评论列表获取失败" })
}

// 发布评论
commentCtrl.list.POST = async ctx => {

  let { body: comment } = ctx.request

	comment.likes = 0
	comment.author = JSON.parse(comment.author)

	// 永久链接
	const permalink = 'https://jkchao.cn/' + (Object.is(comment.post_id, 0) ? 'guestbook' : `article/${comment.post_id}`);

	// 发布评论
	const res = await new Comment(comment)
															.save()
															.catch(err => ctx.throw(500, '服务器内部错误'))
	if (res) {
		handleSuccess({ ctx, result: res, message: '评论发布成功' });
		// 发布成功后，向网站主及被回复者发送邮件提醒，并更新网站聚合
		sendMailToAdminAndTargetUser(res, permalink)
		updateArticleCommentCount([res.post_id])
	} else handleError({ ctx, message: '评论发布失败' })
};

// 批量修改（移回收站、回收站恢复
commentCtrl.list.PATCH = async ctx => {

	const { comments, post_ids, state } = ctx.request.body

	state = Object.is(state, undefined) ? null : Number(state)

	// 验证 comments 0待审核 1通过 2不通过
	if (!comments || !comments.length || Object.is(state, null) || Object.is(state, NaN) || ![0, 1, 2].includes(state)) {
		handleError({ res, message: '缺少有效参数或参数无效' });
		return false;
	}

	const result = await Comment
												.update({ '_id': { $in: comments }}, { $set: { state }}, { multi: true })
												.catch(err => ctx.throw(500, '服务器内部错误'))
	if (result) {
		handleSuccess({ ctx, result, message: '评论批量操作成功' })
		if (post_ids && post_ids.length) {
			updateArticleCommentCount(post_ids)
		}
	} else handleError({ ctx, message: '评论批量操作失败' })
}

// 批量删除评论
commentCtrl.list.DELETE = async ctx => {

	const { comments, post_ids } = ctx.request.body
	// 验证
	if (!comments || !comments.length) {
		handleError({ res, message: '缺少有效参数' })
		return false;
	}
	
	const result = await Comment
												.remove({ '_id': { $in: comments }})
												.catch(err => ctx.throw(500, '服务器内部错误'))
	if (result) {
		handleSuccess({ ctx, result, message: '评论批量删除成功' })
		if (post_ids && post_ids.length) {
			updateArticleCommentCount(post_ids)
		}
	} else handleError({ ctx, message: '评论批量删除失败' });
}

// 删除单个评论
commentCtrl.item.DELETE = async ctx => {

	const _id = ctx.params.id
	// const post_ids = ctx.request.body.post_ids.split(',')

	console.log(ctx.request)
	// console.log(post_ids)
	const res = await Comment
										.findByIdAndRemove(_id)
										.catch(err => ctx.throw(500, '服务器内部错误'))
	if (res) {
		handleSuccess({ ctx, message: '评论删除成功' })
		// updateArticleCommentCount(post_ids)
	}
	else handleError({ ctx, message: '评论删除失败' })
}

// export
exports.list = ctx => handleRequest({ ctx, controller: commentCtrl.list })
exports.item = ctx => handleRequest({ ctx, controller: commentCtrl.item })
