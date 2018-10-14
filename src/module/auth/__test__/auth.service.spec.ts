import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';

describe('auth', () => {
  let authService: AuthService;

  const mockRepository = {
    findOne() {
      return { username: 'jkchao' };
    },
    create() {
      return true;
    }
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule]
    })
      .overrideProvider(getModelToken('Auth'))
      .useValue(mockRepository)
      .compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('findOneByUsername', async () => {
    const res = await authService.findOneByUsername('jkchao');
    expect(res).toMatchObject(mockRepository.findOne());
  });
});
