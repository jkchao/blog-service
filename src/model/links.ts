/*
*
* 友链
*
*/

import { db } from '../mongodb'
import autoIncrement = require('mongoose-auto-increment')
import  mongoosePaginate  = require('mongoose-paginate')
import { Document } from 'mongoose'

// 自增ID初始化
autoIncrement.initialize(db.connection)

export interface ILink extends Document {

  // 友链名称
  name: string

  // 链接
  url: string

  // 发布日期
  create_at: Date

  // 最后修改日期
  update_at: Date
}

// 标签模型
const linkSchema = new db.Schema({
  // 友链名称
  name: { type: String, required: true, validate: /\S+/ },

  // 链接
  url: { type: String, required: true },

  // 发布日期
  create_at: { type: Date, default: Date.now },

  // 最后修改日期
  update_at: { type: Date }
})

// 翻页
linkSchema.plugin(mongoosePaginate)
linkSchema.plugin(autoIncrement.plugin, {
  model: 'Link',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
linkSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() })
  next()
})

// 标签模型
const Link = db.model('Link', linkSchema)

export default Link
