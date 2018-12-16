import { Injectable } from '@nestjs/common';
import { Heros, HerosHasId, HerosQuery } from './interface/heros.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions } from 'mongoose';
import geoip from 'geoip-lite';
import { plainToClass } from 'class-transformer';
import { ListSerializate } from '@/common/serializate/list.serializate';
import { StateEnum } from '@/common/enum/state';

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

    return new this.herosModel({ ...hero, state: 0 }).save();
  }

  // 查
  public async searchHero({ offset = '0', limit = '10', keyword = '', state = 'TODO' }: HerosQuery) {
    // 过滤条件
    const options: PaginateOptions = {
      sort: { id: -1 },
      offset: Number(offset),
      limit: Number(limit)
    };

    // 参数
    const querys = {
      name: new RegExp(keyword || ''),
      state: StateEnum[state]
    };
    const result = await this.herosModel.paginate(querys, options);
    console.log(result);
    const a = plainToClass(ListSerializate, result);
    console.log(a);
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
