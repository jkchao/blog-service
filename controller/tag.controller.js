/*
*
* 标签控制器
*
*/

const Tag = require('../model/tag.model')

const {
  handleRequest,
  handleSuccess,
  handleThrottle
} = require("../utils/handle")

const tagCtrl = { list: {}, item: {} }

// 增加标签
tagCtrl.list.POST = async ctx => {

	const { name, description } = ctx.require.body

	// 添加前，先验证是否有相同 name
	const res = await Tag
							.find({ name })
	console.log(res)
}





exports.list = ctx => handleRequest({ ctx, controller: tagCtrl.list })
exports.item = ctx => handleRequest({ ctx, controller: tagCtrl.item })



