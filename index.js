'use strict'

const Koa = require('koa');
const http = require('http');
const config = require('./config');
const koaBody = require('koa-body'); // post body 解析
const helmet = require('koa-helmet'); // 安全相关
const mongoosePaginate = require('mongoose-paginate');
require('app-module-path').addPath(__dirname + '/');

const mongodb = require('./mongodb');
const redis = require('./redis');
const app = new Koa();

// data secer
mongodb.connect();
redis.connect();

mongoosePaginate.paginate.options = {
	limit: config.APP.LIMIT
};

// middleware
app.use(helmet())
app.use(koaBody({
  jsoinLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}));

// start server
http.createServer(app.callback()).listen(config.APP.PORT, () => {
	console.log(`node-Koa Run！port at ${config.APP.PORT}`)
});

