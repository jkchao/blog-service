'use strict'

const Koa = require('koa')
const http = require('http')
const config = require('./config')
const koaBody = require('koa-body') // post body 解析
const helmet = require('koa-helmet') // 安全相关
const mongoosePaginate = require('mongoose-paginate')
const cors = require('koa-cors') // 跨域
const initAdmin = require('./middlewares/initAdmin')
const Interceptor = require('./middlewares/Interceptor')
// require('app-module-path').addPath(__dirname + '/');

const mongodb = require('./mongodb')
const router = require('./route')
// const redis = require('./redis');
const app = new Koa()

// data secer
mongodb.connect()
// redis.connect();

mongoosePaginate.paginate.options = {
	limit: config.APP.LIMIT
}

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// middleware
app.use(Interceptor)

// 404
app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) ctx.body = { code: 0, message: '无效的api请求'}  
})


app.use(initAdmin)

app.use(helmet())
app.use(koaBody({
  jsoinLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}))

app
  .use(router.routes())
  .use(router.allowedMethods())

// start server
http.createServer(app.callback()).listen(config.APP.PORT, () => {
	console.log(`node-Koa Run！port at ${config.APP.PORT}`)
})

