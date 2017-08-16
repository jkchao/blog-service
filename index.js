'use strict'

const Koa = require('koa')
const http = require('http')

const app = new Koa()
require('app-module-path').addPath(__dirname + '/')