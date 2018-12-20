import Mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import autoIncrement from 'mongoose-auto-increment';
import { config } from '@/config';

const connection = Mongoose.createConnection(config.MONGO_URL);

autoIncrement.initialize(connection);

export const TagSchema = new Mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },

  descript: String,

  create_at: { type: Date, default: Date.now() },

  update_at: { type: Date, default: Date.now() },

  sort: { type: Number, default: 0 }
});

TagSchema.plugin(mongoosePaginate);

TagSchema.plugin(autoIncrement.plugin, {
  model: 'Tags',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

// 时间更新
TagSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});
