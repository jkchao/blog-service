import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { HerosModule } from '../heros.module';
import { HerosService } from '../heros.service';

import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { EmailService } from '../../common/email/email.service';

describe('hero', () => {
  let app: INestApplication;

  describe('success', () => {
    const heroService = {
      searchHero: () => ({}),
      deleteHero: () => ({}),
      createHero: () => ({}),
      updateHero: () => ({})
    };

    const emailService = {
      sendEmail: () => ({}),
      verifyClient: () => ({})
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          HerosModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2',
            context: ({ req, res }: { req: Request; res: Response }) => ({
              request: req
            })
          })
        ]
      })
        .overrideProvider(HerosService)
        .useValue(heroService)
        .overrideProvider(EmailService)
        .useValue(emailService)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('getHeros should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              getHeros {
                total
              }
            }
        `
        })
        .expect(200);
    });

    it('deleteHero success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            deleteHero(_id: "59ef13f0a3ad094f5d294da3") {
              message
            }
          }
          `
        })
        .expect(200);
    });

    it('createHero success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation  {
            createHero(heroInfo: { name: "hha", content: "hah"}) {
              content
            }
          }
          `
        })
        .expect({ data: { createHero: { content: null } } });
    });

    it('updateHero success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation {
            updateHero(heroInfo: {_id: "59ef13f0a3ad094f5d294da3"}) {
              content
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
