import { Injectable } from '@nestjs/common';
import { Heros, HerosHasId, HerosQuery } from './interface/heros.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

@Injectable()
export class HerosService {
  constructor(@InjectModel('Heros') private readonly herosModel: PaginateModel<HerosHasId>) {}

  // 添加
  public createHero(hero: Heros) {
    return new this.herosModel(hero).save();
  }

  // 查
  public searchHero(query: HerosQuery) {
    // 过滤条件
    const options = {
      sort: { id: 1 },
      offset: Number(query.offset || 0),
      limit: Number(query.limit || 10)
    };

    // 参数
    const querys = { name: new RegExp(query.keyword || '') };

    return this.herosModel.paginate(querys, options);
  }

  // 修改
  public updateHero(hero: HerosHasId) {
    return this.herosModel.findByIdAndUpdate(hero.id, hero, { new: true });
  }

  // 删除
  public deleteHero(id: string) {
    return this.herosModel.findByIdAndRemove(id);
  }
}
