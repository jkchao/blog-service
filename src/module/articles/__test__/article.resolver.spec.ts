import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { ArticlesModule } from '../articles.module';
import { ArticlesSercice } from '../articles.service';

import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';

describe('article', () => {
  let app: INestApplication;

  describe('success', () => {
    const articleService = {
      searchArticle: () => ({}),
      deleteArticle: () => ({}),
      createArticle: () => ({}),
      updateArticleWidthId: () => ({}),
      getArticleById: () => ({})
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          ArticlesModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2',
            context: ({ req, res }: { req: Request; res: Response }) => ({
              request: req
            })
          })
        ]
      })
        .overrideProvider(ArticlesSercice)
        .useValue(articleService)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('getArticles should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              getArticles {
                total
              }
            }
        `
        })
        .expect(200);
    });
    it('getArticleById should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              getArticleById(_id: "1234567") {
                _id
              }
            }
        `
        })
        .expect(200);
    });

    it('deleteArticle success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            deleteArticle(_id: "59ef13f0a3ad094f5d294da3") {
              message
            }
          }
          `
        })
        .expect(200);
    });

    it('createArticle success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            createArticle(articleInfo: { title: "hha", keyword: "hah", tag: ["123"]}) {
              content
            }
          }
          `
        })
        .expect({ data: { createArticle: { content: null } } });
    });

    it('updateArticle success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation {
            updateArticle(
              articleInfo: {
                title: "z",
                keyword: "z",
                state: DRAFT,
                _id: "5ae7d66df92cf8122fc0ca89",
              }
            ) {
              title
            }
          }
          `
        })
        .expect(200);
    });

    afterAll(async () => {
      await app.close();
      await mongoose.disconnect();
    });
  });
});
