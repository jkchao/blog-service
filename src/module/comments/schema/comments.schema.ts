import Mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import autoIncrement from 'mongoose-auto-increment';
import { connection } from '@/module/common/db';

autoIncrement.initialize(connection);

export const CommentsSchema = new Mongoose.Schema({
  // 评论所在的文章_id，0代表系统留言板
  post_id: { type: Number, required: true },

  // pid，0代表默认留言
  pid: { type: Number, default: 0 },

  // content
  content: { type: String, required: true, validate: /\S+/ },

  // 被赞数
  likes: { type: Number, default: 0 },

  // ip
  ip: { type: String },

  // ip 物理地址
  city: { type: String },
  range: { type: String },
  country: { type: String },

  // 用户ua
  agent: { type: String, validate: /\S+/ },

  // 评论产生者
  author: {
    name: { type: String, required: true, validate: /\S+/ },
    email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
    // tslint:disable-next-line:max-line-length
    site: {
      type: String,
      validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
    }
  },

  // 状态 0待审核 1通过正常 2不通过
  state: { type: Number, default: 1 },

  // 发布日期
  create_at: { type: Date, default: Date.now() },

  // 最后修改日期
  update_at: { type: Date, default: Date.now() }
});

CommentsSchema.plugin(mongoosePaginate);

CommentsSchema.plugin(autoIncrement.plugin, {
  model: 'Comments',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

CommentsSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});
