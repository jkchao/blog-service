// 路由管理

import Router = require('koa-router')

import config = require('../config')
import controller = require('../controller')

import authIsVerified from '../utils/auth'

const router = new Router({
  prefix: config.APP.ROOT_PATH
})

// Api
router
    .get('/', (ctx, next) => {
      ctx.response.body = config.INFO
    })

    .get('/auth', controller.auth.getAuth) 																	// 获取用户信息
    .put('/auth', controller.auth.putAuth) 																	// 修改用户信息
    .post('/login', controller.auth.login) 																	// 登录

    .get('/option', controller.option.getOption) 														// 获取网站信息
    .put('/option', controller.option.putOption)														// 修改网站信息

    .get('/qiniu', controller.qiniu.getQN) 																	// 七牛 upToken

    .get('/hero', controller.heros.getHeros) 																// 获取留言墙
    .post('/hero', controller.heros.postHero)																// 添加留言墙
    .patch('/hero', controller.heros.patchHero) 														// 修改留言墙状态
    .delete('/hero/:id', controller.heros.deleteHero)												// 删除留言墙

    .get('/tag', controller.tag.getTags) 																		// 获取标签
    .post('/tag', controller.tag.postTag)																		// 添加标签
    .patch('/tag', controller.tag.patchTag)																	// 标签排序
    .put('/tag/:id', controller.tag.putTag)																	// 修改标签
    .delete('/tag/:id', controller.tag.deleteTag)														// 删除标签

    .get('/article', controller.article.getArts) 														// 文章列表
    .post('/article', controller.article.postArt)														// 添加文章
    .get('/article/:id', controller.article.getArt)													// 文章详情
    .patch('/article/:id', controller.article.patchArt)											// 修改文章状态
    .put('/article/:id', controller.article.putArt)													// 修改文章
    .delete('/article/:id', controller.article.deleteArt)										// 删除文章
    .get('/allArticle', controller.article.getAllArts)											// 文章归档

    .get('/comment', controller.comments.getComments)												// 评论列表
    .post('/comment', controller.comments.postComment)											// 增加评论
    .put('/comment/:id', controller.comments.putComment)								    // 修改状态
    .delete('/comment/:id', controller.comments.deleteComment)							// 删除评论

    .post('/like', controller.like.postLike) 																// 喜欢文章 评论

    .get('/link', controller.link.getLinks) 																 // 获取友链列表
    .post('/link', controller.link.postLink)																 // 添加友链
    .patch('/link/:id', controller.link.patchLink)													 // 修改友链状态
    .put('/link/:id', controller.link.putLink)															 // 修改友链
    .delete('/link/:id', controller.link.deleteLink)												 // 删除友链


export default router
