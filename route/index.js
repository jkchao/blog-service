// 路由管理

const config = require('../config');
const controller = require('../controller');
const authIsVerified = require('../utils/auth');
const Router = require('koa-router');
const { handleError } = require('../utils/handle');

const router = new Router({
	prefix: config.APP.ROOT_PATH
});
// Api
router
		.get('/', (ctx, next) => {
			ctx.response.body = config.INFO;
		})
		.post('/login', controller.auth.login) // 登录



// router.get('/auth', UserController.auth)

// // Auth
// router.get('/auth', controller.auth);

// // 七牛Token
// app.all('/qiniu', controller.qiniu);

// 全局option
// router.all('/option', controller.option);

// // sitemap
// app.get('/sitemap.xml', controller.sitemap);

// like
// router.post('/like', controller.like);


// // music
// app.get('/music/pic/:pic_id', controller.music.pic);
// app.get('/music/lrc/:song_id', controller.music.lrc);
// app.get('/music/url/:song_id', controller.music.url);
// app.get('/music/song/:song_id', controller.music.song);
// app.get('/music/list/:play_list_id', controller.music.list);

// // Tag
// router.all('/tag', controller.tag.list);
// router.all('/tag/:tag_id', controller.tag.item);

// // Category
// app.all('/category', controller.category.list);
// app.all('/category/:category_id', controller.category.item);

// // 评论
// app.all('/comment', controller.comment.list);
// app.all('/comment/:comment_id', controller.comment.item);

// // Article
// router.all('/article', controller.article.list);
// router.all('/article/:article_id', controller.article.item);

module.exports = router;
