import { Document } from 'mongoose';
import { CommentInfoDto } from '../dto/comments.dto';

export interface CommentMongo extends Document, CommentInfoDto {}
