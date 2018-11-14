import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';

import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';

// const mock = jest.mock();

// mock.re

jest.mock('../../../common/utils', () => {
  const md5Decode = password => password;
  const createToken = _ => '123456';
  return { md5Decode, createToken };
});

describe('auth', () => {
  let app: INestApplication;

  describe('success', () => {
    const authService = {
      findOne() {
        return { username: 'jkchao', password: '123456' };
      },
      create() {
        return { username: 'jkchao' };
      },
      update() {
        return { username: 'jkchao' };
      }
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          AuthModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2'
          })
        ]
      })
        .overrideProvider(AuthService)
        .useValue(authService)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('login should success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              login(username: "jkchao", password: "123456") {
                token
              }
            }
        `
        })
        .expect(200);
    });

    it('login should passwordword', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              login(username: "jkchao", password: "1234567") {
                token
              }
            }
        `
        })
        .expect(200);
    });

    it('login should account does not exit', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              login(username: "jkchaos", password: "1234567") {
                token
              }
            }
        `
        })
        .expect(200);
    });

    it('getInfo', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              getInfo {
                name
              }
            }
        `
        })
        .expect(200);
    });

    it('getInfo success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation Auth {
            updateUserInfo(userInfo: {_id: "59ef13f0a3ad094f5d294da3", oldPassword: "123456", name: "4"}) {
              name
              gravatar
              slogan
              username
              password
            }
          }
          `
        })
        .expect(200);
    });

    it('updateUserInfo success', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation Auth {
            updateUserInfo(userInfo: {_id: "59ef13f0a3ad094f5d294da3", oldPassword: "1234567", name: "4"}) {
              name
              gravatar
              slogan
              username
              password
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

  describe('error', () => {
    const authService = {
      findOne() {
        return null;
      },
      create() {
        return { username: 'jkchao' };
      },
      update() {
        return { username: 'jkchao' };
      }
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          AuthModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api/v2'
          })
        ]
      })
        .overrideProvider(AuthService)
        .useValue(authService)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('login error', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
            {
              login(username: "jkchao", password: "1234567") {
                token
              }
            }
        `
        })
        .expect(200);
    });

    it('updateUserInfo error', () => {
      return request(app.getHttpServer())
        .post('/api/v2')
        .send({
          query: `
          mutation Auth {
            updateUserInfo(userInfo: {_id: "59ef13f0a3ad094f5d294da3", oldPassword: "1234567", name: "4"}) {
              name
              gravatar
              slogan
              username
              password
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
