import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LikeService {
  constructor() // @InjectModel('Heros') private readonly herosModel: PaginateModel<HerosHasId>
  {
    // ..
  }
}
