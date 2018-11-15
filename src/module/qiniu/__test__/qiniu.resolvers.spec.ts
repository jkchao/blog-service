import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { QiniuModule } from '../qiniu.module';
import { QiniuService } from '../qiniu.service';

import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';

describe('Qiniu', () => {
  let app: INestApplication;

  describe('success', () => {
    const qiniuService = {
      getToken() {
        return { token: '1234' };
      }
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          QiniuModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2'
          })
        ]
      })
        .overrideProvider(QiniuService)
        .useValue(qiniuService)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('getToken should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              getQiniu {
                token
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
