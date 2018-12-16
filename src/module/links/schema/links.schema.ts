import Mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import autoIncrement from 'mongoose-auto-increment';
import { config } from '@/config';

const connection = Mongoose.createConnection(config.MONGO_URL);

autoIncrement.initialize(connection);

export const LinksSchema = new Mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },

  url: { type: String, required: true },

  create_at: { type: Date, default: Date.now },

  update_at: { type: Date, default: Date.now }
});

LinksSchema.plugin(mongoosePaginate);

LinksSchema.plugin(autoIncrement.plugin, {
  model: 'Links',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

LinksSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});
