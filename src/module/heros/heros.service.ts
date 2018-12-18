import { Injectable } from '@nestjs/common';
import { HerosHasId } from './interface/heros.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions } from 'mongoose';
import geoip from 'geoip-lite';
import { QueryHerosDto, InfoDto, UpdateInfoDto } from './dto/heros.dto';

@Injectable()
export class HerosService {
  constructor(@InjectModel('Heros') private readonly herosModel: PaginateModel<HerosHasId>) {}

  // 添加
  public createHero(hero: InfoDto & { ip: string }) {
    const ipLocation = geoip.lookup(hero.ip);
    if (ipLocation) {
      hero.city = ipLocation.city;
      hero.range = ipLocation.range;
      hero.country = ipLocation.country;
    }

    return new this.herosModel({ ...hero, state: 0 }).save();
  }

  // 查
  public async searchHero({ offset = 0, limit = 10, keyword = '', state = 0 }: QueryHerosDto) {
    // 过滤条件
    const options: PaginateOptions = {
      sort: { id: -1 },
      offset,
      limit
    };

    // 参数
    const querys = {
      name: new RegExp(keyword || ''),
      state
    };
    return this.herosModel.paginate(querys, options);
  }

  // 修改
  public updateHero(hero: UpdateInfoDto) {
    return this.herosModel.findByIdAndUpdate(hero._id, hero, { new: true });
  }

  // 删除
  public deleteHero(id: string) {
    return this.herosModel.findByIdAndRemove(id);
  }
}
