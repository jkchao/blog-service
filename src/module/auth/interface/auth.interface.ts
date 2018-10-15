import { Document } from 'mongoose';

export interface AuthInterface extends Document {
  username: string;
  password: string;
  slogan: string;
  gravatar: string;
}
