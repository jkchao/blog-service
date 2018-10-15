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

  it('/POST /auth/login success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'jkchao',
        password: '123456'
      })
      .expect(res => {
        const data = res.body;
        expect(data.code).toBe(200);
        expect(data.message).toBe('请求数据成功');
      });
  });

  it('/POST /auth/login fail password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'jkchao',
        password: '1234567'
      })
      .expect(res => {
        const data = res.body;
        expect(data.code).toBe(200);
        expect(data.message).toBe('密码错误');
      });
  });

  it('/POST /auth/login fail not auth', async () => {
    const authService = {
      findOneByUsername() {
        return null;
      }
    };

    const module = await Test.createTestingModule({
      imports: [AuthModule, MongooseModule.forRoot(config.MONGO_URL)]
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(getModelToken('Auth'))
      .useValue(mockRepository)
      .compile();

    app = module.createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'jkchao',
        password: '1234567'
      })
      .expect(res => {
        const data = res.body;
        expect(data.code).toBe(200);
        expect(data.message).toBe('账号不存在');
      });
  });

  it('/POST /auth/login fail throw error', async () => {
    const authService = {
      findOneByUsername() {
        throw Error();
      }
    };

    const module = await Test.createTestingModule({
      imports: [AuthModule, MongooseModule.forRoot(config.MONGO_URL)]
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(getModelToken('Auth'))
      .useValue(mockRepository)
      .compile();

    app = module.createNestApplication();
    await app.init();

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'jkchao',
        password: '1234567'
      })
      .expect(500);
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });
});
