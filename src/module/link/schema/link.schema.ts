import Mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import autoIncrement from 'mongoose-auto-increment';

export const LinkSchema = new Mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },

  url: { type: String, required: true },

  create_at: { type: Date, default: Date.now },

  update_at: { type: Date }
});

LinkSchema.plugin(mongoosePaginate);

LinkSchema.plugin(autoIncrement.plugin, {
  model: 'Link',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

LinkSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});
