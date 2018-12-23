import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { ArticleMongo, Publish, ArticleType, ArticleState } from './interface/articles.interface';
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

  public async searchArticle({
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
      populate: ['tag']
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

    const res = await this.articlesModel.paginate(querys, options);
    return {
      ...res,
      docs: res.docs.map((doc: ArticleMongo) => {
        return {
          ...doc._doc,
          publish: Publish[doc.publish],
          type: ArticleType[doc.type],
          state: ArticleState[doc.state]
        };
      })
    };
  }

  // 创建
  public async createArticle(info: ArticleInfoDto) {
    const res = await new this.articlesModel(info).save();
    this.httpService
      .post(
        `http://data.zz.baidu.com/urls?site=${config.BAIDU_SITE}&token=${config.BAIDU_TOKEN}`,
        `${config.SITE}/article/${res._id}`,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      )
      .toPromise()
      .then(res => this.logger.log);
    return (
      res && {
        ...res,
        publish: Publish[res.publish],
        type: ArticleType[res.type],
        state: ArticleState[res.state]
      }
    );
  }

  // 修改
  public async updateArticleWidthId(info: ArticleInfoDto) {
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
    const res = await this.articlesModel.findOneAndUpdate({ _id: info._id }, info, { new: true });
    return (
      res && {
        ...res,
        publish: Publish[res.publish],
        type: ArticleType[res.type],
        state: ArticleState[res.state]
      }
    );
  }

  // 修改，没有返回
  public updateArticle(condition: any, doc?: any) {
    return this.articlesModel.update(condition, doc);
  }

  // 根据 id 获取
  public async getArticleById(id: string) {
    const res = await this.articlesModel.findById(id).populate('tag');
    if (res) {
      res.meta.views += 1;
      res.save();
    }

    return (
      res && {
        ...res,
        publish: Publish[res.publish],
        type: ArticleType[res.type],
        state: ArticleState[res.state]
      }
    );
  }

  // 删除
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
    return this.articlesModel.findOneAndRemove({ _id });
  }

  // 查找
  public async findOneArticle(info: Partial<ArticleMongo>) {
    const res = await this.articlesModel.findOne(info);
    return (
      res && {
        ...res,
        publish: Publish[res.publish],
        type: ArticleType[res.type],
        state: ArticleState[res.state]
      }
    );
  }

  // 聚合
  public aggregate(aggregations: any[]) {
    return this.articlesModel.aggregate(aggregations);
  }
}
