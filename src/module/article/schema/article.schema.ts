import Mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import autoIncrement from 'mongoose-auto-increment';
import { config } from '@/config';

const connection = Mongoose.createConnection(config.MONGO_URL);

autoIncrement.initialize(connection);

export const ArticleSchema = new Mongoose.Schema({
  // 文章标题
  title: { type: String, required: true },

  // 关键字
  keyword: { type: String, required: true },

  // 描述
  descript: { type: String, required: false },

  // 标签
  tag: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

  // 内容
  content: { type: String, required: true },

  // 状态 1 发布 2 草稿
  state: { type: Number, default: 1 },

  // 文章公开状态 1 公开 2 私密
  publish: { type: Number, default: 1 },

  // 缩略图
  thumb: String,

  // 文章分类 1 code 2 think 3 民谣
  type: { type: Number },

  // 发布日期
  create_at: { type: Date, default: Date.now },

  // 最后修改日期
  update_at: { type: Date, default: Date.now },

  // 其他元信息
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  }
});

ArticleSchema.set('toObject', { getters: true });

// 翻页 + 自增ID插件配置
ArticleSchema.plugin(mongoosePaginate);
ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

// 时间更新
ArticleSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});
