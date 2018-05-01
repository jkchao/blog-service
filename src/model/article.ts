/*
*
*  文章控制器
*
*/

import { db } from '../mongodb'
import { ITag } from './tag'

import autoIncrement = require('mongoose-auto-increment')
import mongoosePaginate = require('mongoose-paginate')

import { Document } from 'mongoose'

// 自增ID初始化
autoIncrement.initialize(db.connection)

export interface IArticle extends Document {

  // 文章标题
  title: string

  // 关键字
  keyword: string

  // 描述
  descript: string

  // 标签
  tag: ITag[]

  // 内容
  content: string

  // 状态 1 发布 2 草稿
  state: number

  // 文章公开状态 1 公开 2 私密
  publish: number

  // 缩略图
  thumb: string

  // 文章分类 1 code 2 think 3 民谣
  type: string

  // 发布日期
  create_at: Date

  // 最后修改日期
  update_at: Date

  // 其他元信息
  meta: IMeta
}

export interface IMeta {
  views: number
  likes: number
  comments: number
}

const articleSchema = new db.Schema({

  // 文章标题
  title: { type: String, required: true },

  // 关键字
  keyword: { type: String, required: true },

  // 描述
  descript: { type: String, required: false },

  // 标签
  tag: [{ type: db.Schema.Types.ObjectId, ref: 'Tag' }],

  // 内容
  content: { type: String, required: true },

  // 状态 1 发布 2 草稿
  state: { type: Number, default: 1 },

  // 文章公开状态 1 公开 2 私密
  publish: { type: Number, default: 1 },

  // 缩略图
  thumb: String,

  // 文章分类 1 code 2 think 3 民谣
  type: { type: Number },

  // 发布日期
  create_at: { type: Date, default: Date.now },

  // 最后修改日期
  update_at: { type: Date, default: Date.now },

  // 其他元信息
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  }
})

// 转化成普通 JavaScript 对象
articleSchema.set('toObject', { getters: true })

// 翻页 + 自增ID插件配置
articleSchema.plugin(mongoosePaginate)
articleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
articleSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() })
  next()
})

// 文章模型
const Article = db.model('Article', articleSchema)

export default Article
