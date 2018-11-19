import { Injectable } from '@nestjs/common';
import { Link, LinkHasId, LinkQuery } from './interface/link.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

@Injectable()
export class LinkService {
  constructor(@InjectModel('Links') private readonly linksModel: PaginateModel<LinkHasId>) {}

  // 添加
  public createLink(link: Link) {
    return new this.linksModel({ link }).save();
  }

  // 查
  public searchLink(query: LinkQuery) {
    // 过滤条件
    const options = {
      sort: { id: 1 },
      page: Number(query.current_page || 1),
      limit: Number(query.page_size || 10)
    };

    // 参数
    const querys = { name: new RegExp(query.keyword || '') };

    return this.linksModel.paginate(querys, options);
  }

  // 修改
  public updateLink(link: LinkHasId) {
    return this.linksModel.findByIdAndUpdate(link.id, link, { new: true });
  }

  // 删除
  public deleteLink(id: string) {
    return this.linksModel.findByIdAndRemove(id);
  }
}
