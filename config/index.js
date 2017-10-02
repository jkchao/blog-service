const argv = require('yargs').argv;

exports.MONGODB = {
	uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/my_blog`,
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password'
}

exports.QINIU = {
	accessKey: argv.qn_accessKey || 'your_qn_accessKey',
	secretKey: argv.qn_secretKey || 'your_qn_secretKey',
	bucket: argv.qn_bucket || 'your_qn_bucket',
	origin: argv.qn_origin || 'http://blog.u.qiniudn.com',
	uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/'
}

exports.AUTH = {
	jwtTokenSecret: argv.auth_key || 'my_blog',
	defaultUsername: argv.auth_default_username || 'jkchao',
	defaultPassword: argv.auth_default_password || '123456'
}

exports.EMAIL = {
	account: argv.EMAIL_account || '419027396@qq.com',
	password: argv.EMAIL_password || 'your_email_passwrod'
}

exports.APP = {
	ROOT_PATH: '/api',
	LIMIT: 16,
	PORT: 8000
}

exports.INFO = {
	name: 'by_blog',
	version: '1.0.0',
	author: 'jkchao',
	site: 'https://jkchao.cn',
	powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}
