
import * as helmet from 'koa-helmet' // 安全相关
import * as http from 'http'
import * as Koa from 'koa'
import * as koaBody from 'koa-body'  // post body 解析
import * as mongoosePaginate from 'mongoose-paginate'

import * as config from './config'
import initAdmin from './middleWares/initAdmin'
import interceptor from './middleWares/interceptor'

import * as mongodb from './mongodb'
// import redis from './redis'
import router from './route'

// const cors = require('koa-cors')

const app = new Koa()

// data server
mongodb.connect()
// redis.connect();


// @ts-ignore
mongoosePaginate.paginate.options = {
  limit: config.APP.LIMIT
}

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date().getDate() - start.getDate()
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// // middleware
app.use(interceptor)

app.use(initAdmin)

app.use(helmet())
app.use(koaBody({
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}))

// 404 500
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.body = { code: 0, message: '服务器内部错误' }
  }
  if (ctx.status === 404 || ctx.status === 405) ctx.body = { code: 0, message: '无效的api请求'}
})

app
  .use(router.routes())
  .use(router.allowedMethods())

// start server
http.createServer(app.callback()).listen(config.APP.PORT, () => {
  console.log(`node-Koa Run！port at ${config.APP.PORT}`)
})

