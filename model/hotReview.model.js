/*
*
* 网易云热评
*
*/

const mongoose = require('../mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

// 模型
const hotReviewSchema = new mongoose.Schema({

	// 内容
  content: { type: String, required: true, validate: /\S+/ },
  
  // 作者
  auth: { type: String, required: true },

	// 发布日期
  create_at: { type: Date, default: Date.now },
  
  // 排序
	sort: { type: Number, default: 0 },

	// 最后修改日期
	update_at: { type: Date }

})

// 翻页
hotReviewSchema.plugin(mongoosePaginate)
hotReviewSchema.plugin(autoIncrement.plugin, {
	model: 'HotReview',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})

// 时间更新
hotReviewSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

// 模型
const HotReview = mongoose.model('HotReview', hotReviewSchema)

// export
module.exports = HotReview
