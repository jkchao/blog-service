import { Injectable } from '@nestjs/common';
import { Heros, HerosHasId, HerosQuery } from './interface/heros.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import geoip from 'geoip-lite';

@Injectable()
export class HerosService {
  constructor(@InjectModel('Heros') private readonly herosModel: PaginateModel<HerosHasId>) {}

  // 添加
  public createHero(hero: Heros & { ip: string }) {
    const ipLocation = geoip.lookup(hero.ip);

    if (ipLocation) {
      hero.city = ipLocation.city;
      hero.range = ipLocation.range;
      hero.country = ipLocation.country;
    }

    return new this.herosModel(hero).save();
  }

  // 查
  public searchHero({ offset = '0', limit = '10', keyword = '', state = 'TODO' }: HerosQuery) {
    // 过滤条件
    const options = {
      sort: { id: -1 },
      offset: Number(offset || 0),
      limit: Number(limit || 10)
    };

    // 参数
    const querys = {
      name: new RegExp(keyword || ''),
      state
    };

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
