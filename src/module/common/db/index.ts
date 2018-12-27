import Mongoose from 'mongoose';
import { config } from '@/config';

// TODO: 因为 autoIncrement 插件需要引用 连接后的 connection，而 nestjs 没有把 mongoose 暴露出来

export const connection = Mongoose.createConnection(config.MONGO_URL);
