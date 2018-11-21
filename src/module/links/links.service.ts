import { Injectable } from '@nestjs/common';
import { Links, LinksHasId, LinksQuery } from './interface/links.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

@Injectable()
export class LinksService {
  constructor(@InjectModel('Links') private readonly linksModel: PaginateModel<LinksHasId>) {}

  // 添加
  public createLink(link: Links) {
    return new this.linksModel({ link }).save();
  }

  // 查
  public searchLink(query: LinksQuery) {
    // 过滤条件
    const options = {
      sort: { id: 1 },
      offset: Number(query.offset || 1),
      limit: Number(query.limit || 10)
    };

    // 参数
    const querys = { name: new RegExp(query.keyword || '') };

    return this.linksModel.paginate(querys, options);
  }

  // 修改
  public updateLink(link: LinksHasId) {
    return this.linksModel.findByIdAndUpdate(link.id, link, { new: true });
  }

  // 删除
  public deleteLink(id: string) {
    return this.linksModel.findByIdAndRemove(id);
  }
}
