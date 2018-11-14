import { Test } from '@nestjs/testing';

import { OptionsModule } from '../options.module';
import { OptionsService } from '../options.service';
import { getModelToken } from '@nestjs/mongoose';

import mongoose from 'mongoose';

describe('options', () => {
  let optionsService: OptionsService;

  describe('object', () => {
    const mockRepository = {
      findOne() {
        return { username: 'jkchao' };
      },
      findByIdAndUpdate() {
        return { username: 'jkchao' };
      }
    };

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [OptionsModule]
      })
        .overrideProvider(getModelToken('Options'))
        .useValue(mockRepository)
        .compile();

      optionsService = module.get<OptionsService>(OptionsService);
    });

    it('getOptions', async () => {
      const res = await optionsService.getOptions();
      expect(res).toMatchObject(mockRepository.findOne());
    });

    it('updateOptions', async () => {
      const res = await optionsService.updateOptions({ id: '12345' });
      expect(res).toMatchObject(mockRepository.findByIdAndUpdate());
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });
  });

  describe('class', () => {
    class MockRepository {
      public save() {
        return { username: 'jkchao' };
      }
    }

    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [OptionsModule]
      })
        .overrideProvider(getModelToken('Options'))
        .useValue(MockRepository)
        .compile();

      optionsService = module.get<OptionsService>(OptionsService);
    });

    it('updateOptions', async () => {
      const res = await optionsService.updateOptions({ url: '12345' });
      expect(res).toMatchObject({ username: 'jkchao' });
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });
  });
});
