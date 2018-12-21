import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { ArticleMongo } from './interface/articles.interface';
import { QueryArticleDto, ArticleInfoDto } from './dto/article.dto';
import { config } from '@/config';
import { BlogLogger } from '../common/logger/logger';

@Injectable()
export class ArticlesSercice {
  constructor(
    @InjectModel('Articles') private readonly articlesModel: PaginateModel<ArticleMongo>,
    private readonly logger: BlogLogger,
    private readonly httpService: HttpService
  ) {}

  public searchArticle({
    limit = 10,
    offset = 0,
    keyword = '',
    state = 1,
    publish = 1,
    tag,
    type,
    date,
    hot
  }: QueryArticleDto) {
    const options: {
      sort: any;
      limit: number;
      offset: number;
      populate: string[];
      select?: string;
    } = {
      sort: { create_at: -1 },
      offset,
      limit,
      populate: ['tag'],
      select: '-content'
    };

    const querys: {
      $or?: any;
      state?: number;
      publish?: number;
      type?: number;
      create_at?: any;
      tag?: any;
    } = {
      state,
      publish
    };

    if (keyword) {
      const keywordReg = new RegExp(keyword);
      querys.$or = [{ title: keywordReg }, { content: keywordReg }, { description: keywordReg }];
    }

    if (hot) {
      options.sort = {
        'meta.views': -1,
        'meta.likes': -1,
        'meta.comments': -1
      };
    }

    if (date) {
      const getDate = new Date(date).getTime();
      if (!Object.is(getDate.toString(), 'Invalid Date')) {
        querys.create_at = {
          $gte: new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
          $lt: new Date((getDate / 1000 + 60 * 60 * 16) * 1000)
        };
      }
    }

    if (type && [1, 2, 3].includes(type)) {
      querys.type = type;
    }

    if (tag) querys.tag = tag;

    return this.articlesModel.paginate(querys, options);
  }

  public async createArticle(info: ArticleInfoDto) {
    const result = await new this.articlesModel(info).save();
    this.httpService
      .post(
        `http://data.zz.baidu.com/urls?site=${config.BAIDU_SITE}&token=${config.BAIDU_TOKEN}`,
        `${config.SITE}/article/${result._id}`,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      )
      .toPromise()
      .then(res => this.logger.log);
    return result;
  }

  public async updateArticle(info: ArticleMongo) {
    this.httpService
      .post(
        `http://data.zz.baidu.com/urls?site=${config.BAIDU_SITE}&token=${config.BAIDU_TOKEN}`,
        `${config.SITE}/article/${info._id}`,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      )
      .toPromise()
      .then(res => {
        this.logger.log(res.data);
      });
    return this.articlesModel.findByIdAndUpdate(info._id, info, { new: true });
  }

  public async getArticleById(id: string) {
    const res = await this.articlesModel.findById(id).populate('tags');
    if (res) {
      res.meta.views += 1;
      res.save();
    }

    return res;
  }

  public deleteArticle(_id: string) {
    this.httpService
      .post(
        `http://data.zz.baidu.com/del?site=${config.BAIDU_SITE}&token=${config.BAIDU_TOKEN}`,
        `${config.SITE}/article/${_id}`,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      )
      .toPromise()
      .then(res => {
        this.logger.log(res.data);
      });
    return this.articlesModel.findByIdAndRemove(_id);
  }

  public findOne(info: { id: number }) {
    return this.articlesModel.findOne(info);
  }
}
