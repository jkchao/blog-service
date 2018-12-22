import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { TagMongo } from './interface/tags.interface';
import { TagInfoDto, CreateTagDto, QueryTagsDto } from './dto/tag.dto';
import { ArticlesSercice } from '../articles/articles.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel('Tags') private readonly tagsModel: PaginateModel<TagMongo>,
    private readonly articlesService: ArticlesSercice
  ) {}

  public async searchTags({ limit = 10, offset = 0, keyword = '' }: QueryTagsDto, isAuth: boolean) {
    const options = {
      sort: { sort: 1 },
      offset,
      limit
    };

    const querys = {
      name: new RegExp(keyword)
    };

    const tags = await this.tagsModel.paginate(querys, options);

    const tagClone: PaginateResult<TagMongo> = JSON.parse(JSON.stringify(tags));

    // 查找文章中标签聚合
    let $match = {};

    // 前台请求时，只有已经发布的和公开
    if (!isAuth) $match = { state: 1, publish: 1 };

    const article = await this.articlesService.aggregate([
      { $match },
      { $unwind: '$tag' },
      {
        $group: {
          _id: '$tag',
          num_tutorial: { $sum: 1 }
        }
      }
    ]);
    if (article) {
      tagClone.docs.forEach(t => {
        const finded = article.find(c => String(c._id) === String(t._id));
        t.count = finded ? finded.num_tutorial : 0;
      });
    }

    return tagClone;
  }

  public createTag(tag: CreateTagDto) {
    return new this.tagsModel(tag).save();
  }

  public async sortTag(ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
      await this.updateTag({
        _id: ids[i],
        sort: i + 1
      });
    }
  }

  public updateTag(tag: Partial<TagInfoDto>) {
    return this.tagsModel.findOneAndUpdate({ _id: tag._id }, tag, { new: true });
  }

  public deleteTag(_id: string) {
    return this.tagsModel.findOneAndRemove({ _id });
  }
}
