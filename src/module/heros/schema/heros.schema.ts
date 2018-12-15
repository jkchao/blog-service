import Mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import autoIncrement from 'mongoose-auto-increment';
import { config } from '@/config';

const connection = Mongoose.createConnection(config.MONGO_URL);

autoIncrement.initialize(connection);

export const HerosSchema = new Mongoose.Schema({
  // 名称
  name: { type: String },

  // 内容
  content: { type: String, required: true, validate: /\S+/ },

  // 状态  0 待审核，1 审核通过， 2 审核不通过
  state: { type: Number, default: 0 },

  // ip
  ip: { type: String },

  // ip 物理地址
  city: { type: String },
  range: { type: String },
  country: { type: String },

  // 用户ua
  agent: { type: String, validate: /\S+/ },

  // 发布日期
  create_time: { type: Date, default: Date.now() }
});

HerosSchema.plugin(mongoosePaginate);

HerosSchema.plugin(autoIncrement.plugin, {
  model: 'Heros',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

HerosSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});
