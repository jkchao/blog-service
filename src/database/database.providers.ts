import mongoose from 'mongoose';
import { config } from '../config';
import { Logger, Provider } from '@nestjs/common';

const logger = new Logger();

export const databaseProviders: Provider = {
  provide: 'DbConnectionToken',
  useFactory: async (): Promise<typeof mongoose> => {
    const db = await mongoose.connect(
      config.MONGO_URL,
      { useNewUrlParser: true }
    );

    mongoose.connection.on('error', error => {
      logger.error('数据库链接失败');
    });

    mongoose.connection.on('open', () => {
      logger.log('数据库连接成功');
    });

    return db;
  }
};
