const argv = require('yargs').argv

export const MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/my_blog`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password'
}

export const QINIU = {
  accessKey: argv.qn_accessKey || 'your_qn_accessKey',
  secretKey: argv.qn_secretKey || 'your_qn_secretKey',
  bucket: argv.qn_bucket || 'blog',
  origin: argv.qn_origin || 'http://blog.u.qiniudn.com',
  uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/'
}

export const AUTH = {
  jwtTokenSecret: argv.auth_key || 'my_blog',
  defaultUsername: argv.auth_default_username || 'jkchao',
  defaultPassword: argv.auth_default_password || '123456'
}

export const EMAIL = {
  account: argv.EMAIL_account || 'your_email_account',
  password: argv.EMAIL_password || 'your_email_password'
}

export const BAIDU = {
  site: argv.baidu_site || 'your_baidu_site',
  token: argv.baidu_token || 'your_baidu_token'
}

export const APP = {
  ROOT_PATH: '/api',
  LIMIT: 16,
  PORT: 8000
}

export const INFO = {
  name: 'by_blog',
  version: '1.0.0',
  author: 'jkchao',
  site: 'https://jkchao.cn',
  powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}
