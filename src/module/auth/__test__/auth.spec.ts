import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { DatabaseModule } from '../../../database/database.module';

describe('auth', () => {
  let app: INestApplication;
  const authService = {
    findOneByUsername() {
      return { username: 'jkchao', password: 123456 };
    }
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule]
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/POST auth/login success', () => {
    return request(app.getHttpServer())
      .post('auth/login')
      .expect(200);
  });
});
