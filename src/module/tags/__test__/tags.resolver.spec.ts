import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { TagModule } from '../tags.module';
import { TagsService } from '../tags.service';

import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';

describe('tags', () => {
  let app: INestApplication;

  describe('success', () => {
    const tagsService = {
      searchTags: () => ({}),
      deleteTag: () => ({}),
      createTag: () => ({}),
      updateTag: () => ({}),
      sortTag: () => ({})
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          TagModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2',
            context: ({ req, res }: { req: Request; res: Response }) => ({
              request: req
            })
          })
        ]
      })
        .overrideProvider(TagsService)
        .useValue(tagsService)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('getTags should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .set('Authorization', '')
        .send({
          query: `
            {
              getTags {
                total
              }
            }
        `
        })
        .expect(200);
    });

    it('getTags should success with auth', () => {
      const token =
        // tslint:disable-next-line:max-line-length
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXQiOiJTVC1zQUdZVU56V3pKV0RGQXZESXJUcm1UUVVoa0FMd2tBT0FwamJDcnFtck1tR1pnS0dKalhHSGxmUEN6VWhoeFJlU0lpWFBRWkJQQVZxaERUalpBeFdVa3l5d0JmWHFBQldQZGhNblNiV0N3bE1LRnlpeHh1QXJlbVJVd3JyUG1BcCIsInVzZXJOYW1lIjoiamFja193Y2d1byIsInVzZXJJZCI6ImYwNGQ0YTdmLTM0YWEtNGEwYi05NzZkLWIxOWNiYWRjZTlkZCIsInByb2ZpbGVzIjpbeyJicmFuZElkIjoiYTI5ZmEyYTctN2UwYS00MDI3LThhM2ItYWM4ZTExYmFkODU5Iiwicm9sZSI6Ik1hc3RlciJ9XSwiZXh0IjoxNTQ1NjMxODczLCJpYXQiOjE1NDUwMjcwNzN9.IVnnszu5_fp_dqt2lOXk0eEESEFE56xmalHgmyhlMnU';
      return request(app.getHttpServer())
        .post('/api/v2')
        .set('Authorization', token)
        .send({
          query: `
            {
              getTags {
                total
              }
            }
        `
        })
        .expect(200);
    });

    it('deleteTag success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            deleteTag(_id: "59ef13f0a3ad094f5d294da3") {
              message
            }
          }
          `
        })
        .expect({ data: { deleteTag: { message: 'success' } } });
    });

    it('createTag success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            createTag(tagInfo: { name: "hha"}) {
              name
            }
          }
          `
        })
        .expect(200);
    });

    it('sortTag success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            sortTag(ids: ["1", "2"]) {
              message
            }
          }
          `
        })
        .expect({ data: { sortTag: { message: 'success' } } });
    });

    it('updateTag success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation {
            updateTag(
              tagInfo: {
                _id: "5c1b34bc467e60088e3948db"
              }
            ) {
              name
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
