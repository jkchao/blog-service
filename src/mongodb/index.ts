// 数据库模块
import * as mongoose from 'mongoose'
import * as config from '../config'

(mongoose as any).Promise = global.Promise

// export const mongoose = mongoose

export const db = mongoose

// 数据库
export const connect = () => {

  // 连接数据库
  mongoose.connect(config.MONGODB.uri, { useMongoClient: true})

  // 连接错误
  mongoose.connection.on('error', error => {
    console.log('数据库连接失败!', error)
  })

  // 连接成功
  mongoose.connection.once('open', () => {
    console.log('数据库连接成功!')
  })

  return mongoose
}
