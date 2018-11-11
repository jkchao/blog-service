import request from 'supertest';
import axios from 'axios';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';

import { MongooseModule, getModelToken } from '@nestjs/mongoose';
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

const mockRepository = {
  findOne() {
    return { username: 'jkchao' };
  },
  create() {
    return { username: 'jkchao' };
  }
};

describe('auth', () => {
  let app: INestApplication;

  describe('success', () => {
    const authService = {
      findOne() {
        return { username: 'jkchao', password: '123456' };
      }
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          AuthModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api'
          })
        ]
      })
        .overrideProvider(AuthService)
        .useValue(authService)
        .overrideProvider(getModelToken('Auth'))
        .useValue(mockRepository)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('should success', () => {
      return request(app.getHttpServer())
        .post('/api')
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

    it('should fail', () => {
      return request(app.getHttpServer())
        .post('/api')
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

    afterAll(async () => {
      await app.close();
      await mongoose.disconnect();
    });
  });

  describe('success', () => {
    const authService = {
      findOne() {
        return null;
      }
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(config.MONGO_URL),
          AuthModule,
          GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            path: '/api'
          })
        ]
      })
        .overrideProvider(AuthService)
        .useValue(authService)
        .overrideProvider(getModelToken('Auth'))
        .useValue(mockRepository)
        .compile();

      app = await module.createNestApplication().init();
    });

    it('should fail', () => {
      return request(app.getHttpServer())
        .post('/api')
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

    afterAll(async () => {
      await app.close();
      await mongoose.disconnect();
    });
  });
});
