/*
*
* 设置数据模型
*
*/

import { db } from '../mongodb'
import { Document } from 'mongoose'

export interface IOption extends Document  {
  // 网站标题
  title: string

  // 网站副标题
  sub_title: string

  // 关键字
  keyword: string

  // 网站描述
  descript: string

  // 站点地址
  url: string

  // 网站官邮
  email: string

  // 备案号
  icp: string

  // 其他元信息
  meta: {

    // 被喜欢次数
    likes: number
  }
}

const optionSchema = new db.Schema({

  // 网站标题
  title: { type: String, required: true },

  // 网站副标题
  sub_title: { type: String, required: true },

  // 关键字
  keyword: { type: String },

  // 网站描述
  descript: String,

  // 站点地址
  url: { type: String, required: true },

  // 网站官邮
  email: String,

  // 备案号
  icp: String,

  // 其他元信息
  meta: {

    // 被喜欢次数
    likes: { type: Number, default: 0 }
  }
})

const Option = db.model('Option', optionSchema)

export default Option
