/*
*
* 英雄版
*
*/

import { db } from '../mongodb'
import autoIncrement = require('mongoose-auto-increment')
import mongoosePaginate = require('mongoose-paginate')
import { Document } from 'mongoose'

// 自增ID初始化
autoIncrement.initialize(db.connection)

export interface IHero extends Document {
  // 名称
  name: string

  // 内容
  content: string

  // 状态  0 待审核，1 审核通过， 2 审核不通过
  state: number

  // ip
  ip: string

  // ip 物理地址
  city: string
  range: string
  country: string

  // 用户ua
  agent: string

  // 发布日期
  create_time: Date
}

// 标签模型
const herosSchema = new db.Schema({

  // 名称
  name: { type: String },

  // 内容
  content: { type: String, required: true, validate: /\S+/ },

  // 状态  0 待审核，1 审核通过， 2 审核不通过
  state: { type: Number, default: 0 },

  // ip
  ip: { type: String },

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
const Heros = db.model('Heros', herosSchema)

export default Heros
