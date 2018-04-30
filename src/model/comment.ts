/*
*
* 评论数据模型
*
*/

import { db } from '../mongodb'
import autoIncrement = require('mongoose-auto-increment')
import mongoosePaginate = require('mongoose-paginate')
import { Document } from 'mongoose'

// 自增ID初始化
autoIncrement.initialize(db.connection)

export interface IComment extends Document {

  // 评论所在的文章_id，0代表系统留言板
  post_id: number

  // pid，0代表默认留言
  pid: number

  // content
  content: string

  // 被赞数
  likes: number

  // ip
  ip: string

  // ip 物理地址
  city: string,
  range: string,
  country: string,

  // 用户ua
  agent: string,

  // 评论产生者
  author: IAuthor

  // 状态 0待审核 1通过正常 2不通过
  state: number

  // 发布日期
  create_at: Date,

  // 最后修改日期
  update_at: Date
}

export interface IAuthor {
  name: string
  email: string
  site: string
}

// 标签模型
const commentSchema = new db.Schema({

  // 评论所在的文章_id，0代表系统留言板
  post_id: { type: Number, required: true },

  // pid，0代表默认留言
  pid: { type: Number, default: 0 },

  // content
  content: { type: String, required: true, validate: /\S+/ },

  // 被赞数
  likes: { type: Number, default: 0 },

  // ip
  ip: { type: String },

  // ip 物理地址
  city: { type: String },
  range: { type: String },
  country: { type: String },

  // 用户ua
  agent: { type: String, validate: /\S+/ },

  // 评论产生者
  author: {
    name: { type: String, required: true, validate: /\S+/ },
    email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
    site: { type: String, validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ }
  },

  // 状态 0待审核 1通过正常 2不通过
  state: { type: Number, default: 1 },

  // 发布日期
  create_at: { type: Date, default: Date.now },

  // 最后修改日期
  update_at: { type: Date }
})

// 翻页 + 自增ID插件配置
commentSchema.plugin(mongoosePaginate)
commentSchema.plugin(autoIncrement.plugin, {
  model: 'Comment',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
commentSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() })
  next()
})

// 标签模型
const Comment = db.model('Comment', commentSchema)

export default Comment
