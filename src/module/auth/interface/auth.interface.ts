import { Document } from 'mongoose';

export interface AuthMongo extends Document {
  username: string;
  password: string;
  slogan: string;
  gravatar: string;
}
