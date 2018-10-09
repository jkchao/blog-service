import { Connection } from 'mongoose';
import { AuthSchema } from './schema/auth.schema';

export const userProviders = {
  provide: 'AuthModelToken',
  useFactory: (connection: Connection) => connection.model('Auth', AuthSchema),
  inject: ['DbConnectionToken']
};
