/*
*
* 权限和用户数据模型
*
*/

const crypto = require('crypto');
const config = require('../config');
const mongoose = require('../mongodb').mongoose;
// const autoIncrement = require('mongoose-auto-increment');

// autoIncrement.initialize(mongoose.connection);

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

// authSchema.plugin(autoIncrement.plugin, {
// 	model: 'Tag',
// 	field: 'id',
// 	startAt: 1,
// 	incrementBy: 1
// });

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
