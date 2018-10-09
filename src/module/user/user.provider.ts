import { Connection } from 'mongoose';
import { UserSchema } from './schema/user.schema';

export const catsProviders = {
  provide: 'CatModelToken',
  useFactory: (connection: Connection) => connection.model('User', UserSchema),
  inject: ['DbConnectionToken']
};
