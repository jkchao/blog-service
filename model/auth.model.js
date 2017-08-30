/*
*
* 权限和用户数据模型
*
*/

const crypto = require('crypto');
const config = require('../config');
const mongoose = require('../mongodb').mongoose;
const authSchema = new mongoose.Schema({

	// 名字
	name: { type: String, default: '' },

	username: {
		type: String,
		default: config.AUTH.defaultUsername
	},

	// 签名
	slogan: { type: String, default: '' },

	// 头像
	gravatar: { type: String, default: '' },

	// 密码
	password: { 
		type: String,
		default: crypto.createHash('md5').update(config.AUTH.defaultPassword).digest('hex')
	}
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
