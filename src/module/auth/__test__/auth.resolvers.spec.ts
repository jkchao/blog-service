import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';

import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { config } from '../../../config';

import mongoose from 'mongoose';

jest.mock('../../../common/utils', () => {
  const md5Decode = password => password;
  const createToken = token => token;
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
  const authService = {
    findOneByUsername() {
      return { username: 'jkchao', password: '123456' };
    }
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(config.MONGO_URL), AuthModule]
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(getModelToken('Auth'))
      .useValue(mockRepository)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should success', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
              login(username: "jkchao", password: "123456") {
                token
              }
            }`
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });
});
