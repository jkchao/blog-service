import { Test } from '@nestjs/testing';

import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';

import mongoose from 'mongoose';

describe('auth', () => {
  let authService: AuthService;

  const mockRepository = {
    findOne() {
      return { username: 'jkchao' };
    },
    create() {
      return { username: 'jkchao' };
    },
    findOneAndUpdate() {
      return { username: 'jkchao' };
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

  it('findOne', async () => {
    const res = await authService.findOne();
    expect(res).toMatchObject(mockRepository.findOne());
  });

  it('findOne', async () => {
    const res = await authService.create({ username: '', password: '' });
    expect(res).toMatchObject(mockRepository.create());
  });

  it('findOne', async () => {
    const res = await authService.update({});
    expect(res).toMatchObject(mockRepository.findOne());
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
