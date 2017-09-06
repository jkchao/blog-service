const argv = require('yargs').argv;

exports.MONGODB = {
	uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/my_blog`,
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password'
}

exports.QINIU = {
	accessKey: argv.qn_accessKey || 'uRYE0M3ru9g5Al1h-H1sUV6qqFKAJ4F4yPQXoLcf',
	secretKey: argv.qn_secretKey || '_So4S5DZNYmvDezZqav7iB4Z4UZZMawKM_0Uokph',
	bucket: argv.qn_bucket || 'blog',
	origin: argv.qn_origin || 'http://blog.u.qiniudn.com',
	uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/'
}

exports.AUTH = {
	data: argv.auth_data || { user: 'root' },
	jwtTokenSecret: argv.auth_key || 'my_blog',
	defaultUsername: argv.auth_default_username || 'jkchao',
	defaultPassword: argv.auth_default_password || '123456'
}

exports.BAIDU = {
	site: argv.baidu_site || 'your baidu site domain like : surmon.me',
	token: argv.baidu_token || 'your baidu seo push token'
}

exports.EMAIL = {
	account: argv.email_account || '',
	password: argv.email_password || 'your email password'
}

exports.AKISMET = {
	key: argv.akismet_key || 'your akismet Key',
	blog: argv.akismet_blog || 'your akismet blog site, like'
}

exports.APP = {
	ROOT_PATH: '/api',
	LIMIT: 16,
	PORT: 8000
}

exports.INFO = {
	name: 'by_blog',
	version: '1.1.0',
	author: 'Surmon',
	site: '',
	powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}
