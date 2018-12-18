import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { LinksModule } from '../links.module';
import { LinksService } from '../links.service';

import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';

describe('links', () => {
  let app: INestApplication;

  describe('success', () => {
    const linksService = {
      searchLink: () => ({}),
      deleteLink: () => ({}),
      createLink: () => ({}),
      updateLink: () => ({})
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          LinksModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2'
          })
        ]
      })
        .overrideProvider(LinksService)
        .useValue(linksService)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('getLinks should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              getLinks {
                total
              }
            }
        `
        })
        .expect(200);
    });

    it('deleteLink success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            deleteLink(_id: "59ef13f0a3ad094f5d294da3") {
              _id
            }
          }
          `
        })
        .expect(200);
    });

    it('createLink success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            createLink(linkInfo: { name: "hha", url: "hah"}) {
              url
            }
          }
          `
        })
        .expect(200);
    });

    it('updateLink success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation {
            updateLink(linkInfo: {_id: "59ef13f0a3ad094f5d294da3"}) {
              url
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
