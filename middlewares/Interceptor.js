const authIsVerified = require('../utils/auth');

module.exports = async (ctx, next) => {

  // 拦截器
	const allowedOrigins = ['https://jkchao.cn', 'https://admin.jkchao.cn'];
	const origin = ctx.request.headers.origin || '';
	if (allowedOrigins.includes(origin)) {
		ctx.set('Access-Control-Allow-Origin', origin);
	};
	ctx.set({
		'Access-Control-Allow-Headers': 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',
		'Access-Control-Allow-Methods': 'PUT,PATCH,POST,GET,DELETE,OPTIONS',
		'Access-Control-Max-Age': '1728000',
		'Content-Type': 'application/json;charset=utf-8',
		'X-Powered-By': 'my_blog 1.0.0'
	});

	// OPTIONS
	if (ctx.request.method == 'OPTIONS') {
		ctx.status = 200;
		return false;
	};

	// 如果是生产环境，需要验证用户来源渠道，防止非正常请求
	if (Object.is(process.env.NODE_ENV, 'production')) {
		const { origin, referer } = ctx.request.headers;
		const originVerified = (!origin	|| origin.includes('jkchao.cn')) && 
														(!referer || referer.includes('jkchao.cn'))
		if (!originVerified) {
			ctx.thorw(403, { code: 0, message: '来者何人！' })
			return false;
		};
	};

	// 排除auth的post请求 && 评论的post请求 && like请求 && hero post
	const isLike = Object.is(ctx.request.url, '/api/like') && Object.is(ctx.request.method, 'POST');
	const isPostAuth = Object.is(ctx.request.url, '/api/auth') && Object.is(ctx.request.method, 'POST');
	const isLogin = Object.is(ctx.request.url, '/api/login') && Object.is(ctx.request.method, 'POST');
	const isHero = Object.is(ctx.request.url, '/api/hero') && Object.is(ctx.request.method, 'POST');
	const isPostComment = Object.is(ctx.request.url, '/api/comment') && Object.is(ctx.request.method, 'POST');
	if (isLike || isPostAuth || isPostComment || isLogin || isHero) {
		await next();
		return false;
	};

	// 拦截所有非管路员的非get请求
	if (!authIsVerified(ctx.request) && !Object.is(ctx.request.method, 'GET')) {
		ctx.throw(401, { code: -2, message: '来者何人！' })
		return false;
	};

	await next();
}