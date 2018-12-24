import { Injectable } from '@nestjs/common';
import { HerosHasId } from './interface/heros.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions } from 'mongoose';
import geoip from 'geoip-lite';
import { QueryHerosDto, HerosInfoDto, UpdateInfoDto } from './dto/heros.dto';
import { StateEnum } from '@/common/enum/state';

@Injectable()
export class HerosService {
  constructor(@InjectModel('Heros') private readonly herosModel: PaginateModel<HerosHasId>) {}

  // 添加
  public async createHero(hero: HerosInfoDto & { ip: string }) {
    const ipLocation = geoip.lookup(hero.ip);
    if (ipLocation) {
      hero.city = ipLocation.city;
      hero.range = ipLocation.range;
      hero.country = ipLocation.country;
    }

    const res = await new this.herosModel({ ...hero, state: 0 }).save();

    return (
      res && {
        ...res._doc,
        state: StateEnum[res.state]
      }
    );
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
    const res = await this.herosModel.paginate(querys, options);

    return {
      ...res,
      docs: res.docs.map(doc => {
        return {
          ...doc._doc,
          state: StateEnum[doc.state]
        };
      })
    };
  }

  // 修改
  public async updateHero(hero: UpdateInfoDto) {
    const res = await this.herosModel.findOneAndUpdate({ _id: hero._id }, hero, { new: true });
    return (
      res && {
        ...res._doc,
        state: StateEnum[res.state]
      }
    );
  }

  // 删除
  public deleteHero(_id: string) {
    return this.herosModel.findOneAndRemove({ _id });
  }
}
