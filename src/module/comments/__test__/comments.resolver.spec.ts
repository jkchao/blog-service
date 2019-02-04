import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { CommentsModule } from '../comments.module';
import { CommentsService } from '../comments.service';

import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ArticlesSercice } from '../../articles/articles.service';

describe('comments', () => {
  let app: INestApplication;

  describe('success', () => {
    const commentsService = {
      searchComments: () => ({}),
      deleteComment: () => ({}),
      createComment: () => ({}),
      sendEmail: () => ({}),
      updateArticleCommentCount: () => ({}),
      updateComment: () => ({})
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          CommentsModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2',
            context: ({ req, res }: { req: Request; res: Response }) => ({
              request: req
            })
          })
        ]
      })
        .overrideProvider(CommentsService)
        .useValue(commentsService)
        .overrideProvider(ArticlesSercice)
        .useValue({
          findOneArticle() {
            return { _id: '123' };
          }
        })
        .compile();

      app = await module.createNestApplication().init();
    });

    it('getComments should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              getComments {
                total
              }
            }
        `
        })
        .expect(200);
    });

    it('deleteComment success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            deleteComment(_id: "59ef13f0a3ad094f5d294da3", post_id: 1) {
              message
            }
          }
          `
        })
        .expect(200);
    });

    it('createComment success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation {
            createComment(
              commentInfo: {
                post_id: 0
                content: "jaja"
                author: {
                  name: "jkchao",
                  email: "jkchaom@gmail.com"
                }
              }
            ){
              _id
            }
          }
          `
        })
        .expect(200);
    });

    it('updateComment success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation {
            updateComment(
              commentInfo: {
                _id: "5ac8a0082780d4345de4f927"
              }
            ){
              id
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
