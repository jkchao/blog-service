import { Test } from '@nestjs/testing';

import { ArticlesModule } from '../articles.module';
import { ArticlesSercice } from '../articles.service';
import { getModelToken } from '@nestjs/mongoose';

import mongoose from 'mongoose';
import { ArticleInfoDto, QueryArticleDto } from '../dto/article.dto';
import { HttpService } from '@nestjs/common';

describe('articles', () => {
  let articlesService: ArticlesSercice;

  // tslint:disable-next-line:class-name
  class mockRepository {
    public static paginate() {
      return {
        docs: []
      };
    }
    public static aggregate() {
      return {};
    }
    public static update() {
      return {};
    }
    public static findOne() {
      return {};
    }
    public static findById() {
      return {
        populate() {
          return {
            meta: { views: 2 },
            save: () => ({})
          };
        }
      };
    }
    public static findOneAndUpdate() {
      return {};
    }
    public static findOneAndRemove() {
      return {};
    }

    public save() {
      return {};
    }
  }

  mockRepository.prototype.save = () => ({});

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ArticlesModule]
    })
      .overrideProvider(getModelToken('Articles'))
      .useValue(mockRepository)
      .overrideProvider(HttpService)
      .useValue({
        get() {
          return {};
        },
        post() {
          return {
            toPromise() {
              return new Promise(resolve => {
                // ..
              });
            }
          };
        }
      })
      .compile();

    articlesService = module.get<ArticlesSercice>(ArticlesSercice);
  });

  it('createArticle', async () => {
    const obj = {} as ArticleInfoDto;
    const res = await articlesService.createArticle(obj);
    expect(res).toMatchObject(new mockRepository().save());
  });

  it('searchArticle', async () => {
    const obj = ({
      keyword: 'hah',
      hot: true,
      data: new Date(),
      type: 2,
      tag: '123456'
    } as unknown) as QueryArticleDto;
    const res = await articlesService.searchArticle(obj);
    expect(res).toMatchObject(mockRepository.paginate());
  });

  it('updateArticle', async () => {
    const obj = {} as ArticleInfoDto;
    const res = await articlesService.updateArticle(obj);
    expect(res).toMatchObject({});
  });

  it('updateArticleWidthId', async () => {
    const obj = {} as ArticleInfoDto;
    const res = await articlesService.updateArticleWidthId(obj);
    expect(res).toMatchObject({});
  });

  it('getArticleById', async () => {
    const obj = {} as ArticleInfoDto;
    const res = await articlesService.getArticleById('');
    expect(res).toMatchObject({});
  });

  it('findOneArticle', async () => {
    const obj = {} as ArticleInfoDto;
    const res = await articlesService.findOneArticle('');
    expect(res).toMatchObject({});
  });

  it('deleteArticle', async () => {
    const res = await articlesService.deleteArticle('12345');
    expect(res).toMatchObject({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
