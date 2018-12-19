import { Document } from 'mongoose';
import { CommentInfoDto } from '../dto/comments.dto';

export interface CommentInfo extends Document, CommentInfoDto {}
