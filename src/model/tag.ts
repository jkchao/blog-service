/*
*
* 标签数据模型
*
*/

import { db } from '../mongodb'
import { Document } from 'mongoose'
import autoIncrement = require('mongoose-auto-increment')
import mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(db.connection)

export interface ITag extends Document {
  // 标签名称
  name: string

  // 描述
  descript: string

  // 创建日期
  create_at: Date

  // 更新日期
  update_at: Date

  // 排序
  sort: number
}

// 标签模型
const tagSchema = new db.Schema({

  name: { type: String, required: true, validate: /\S+/ },

  descript: String,

  create_at: { type: Date, default: Date.now },

  update_at: { type: Date },

  sort: { type: Number, default: 0 }

})

// 翻页
tagSchema.plugin(mongoosePaginate)
tagSchema.plugin(autoIncrement.plugin, {
  model: 'Tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
tagSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() })
  next()
})

// 标签模型
const Tag = db.model('Tag', tagSchema)

export default Tag
