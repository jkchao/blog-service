/*
*
* 书本数据模型
*
*/

const mongoose = require('../mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

// 标签模型
const bookSchema = new mongoose.Schema({

	// 书本名称名称
  name: { type: String, required: true, validate: /\S+/ },
  
  // 书本状态 1 待售 2 已售
  state: { type: Number, default: 1 },

	// 标签描述
  descript: String,
  
	// 缩略图
  thumb: String,

	// 发布日期
	create_at: { type: Date, default: Date.now },

	// 最后修改日期
	update_at: { type: Date }
})

// 翻页
tagSchema.plugin(mongoosePaginate)
tagSchema.plugin(autoIncrement.plugin, {
	model: 'Book',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})

// 时间更新
tagSchema.pre('findOneAndUpdate', function(next) {
	this.findOneAndUpdate({}, { update_at: Date.now() })
	next()
})

// 标签模型
const Book = mongoose.model('Book', bagSchema)

// export
module.exports = Book