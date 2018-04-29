/*
*
* 书本数据模型
*
*/

import { db } from '../mongodb'
import autoIncrement = require('mongoose-auto-increment')
import mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(db.connection)

export interface IBook {
  // 书本名称名称
  name: string

  // 书本状态 1 待售 2 已售
  state: number

  // 标签描述
  descript: string,

  // 缩略图
  thumb: string

  // 发布日期
  create_at: Date,

  // 最后修改日期
  update_at: Date
}

// 标签模型
const bookSchema = new db.Schema({

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
bookSchema.plugin(mongoosePaginate)
bookSchema.plugin(autoIncrement.plugin, {
  model: 'Book',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
bookSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() })
  next()
})

// 标签模型
const Book = db.model('Book', bookSchema)

export default Book
