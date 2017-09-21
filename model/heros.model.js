/*
*
* 英雄版
*
*/

const mongoose = require('../mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

// 标签模型
const herosSchema = new mongoose.Schema({

	// 名称
	name: { type: String, required: true, validate: /\S+/ },

	// 内容
  content: String,

  // github
  github: String,

  // blog
  blog: String,

  // 状态  0 待审核，1 审核通过， 2 审核不通过
	state: { type: Number, default: 0 },

	// ip
	ip: { type: String },

	// range
	range: { type: String },

	// ip 物理地址
	city: { type: String },
	range: { type: String },
	country: { type: String },

	// 用户ua
	agent: { type: String, validate: /\S+/ },
	
	// 发布日期
	create_time: { type: Date, default: Date.now }

})

// 翻页 + 自增ID插件配置
herosSchema.plugin(mongoosePaginate)
herosSchema.plugin(autoIncrement.plugin, {
	model: 'Heros',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})


// 标签模型
const Heros = mongoose.model('Heros', herosSchema)

// export
module.exports = Heros
