import { Test } from '@nestjs/testing';

import { HerosModule } from '../heros.module';
import { HerosService } from '../heros.service';
import { getModelToken } from '@nestjs/mongoose';

import mongoose from 'mongoose';
import { HerosInfoDto, QueryHerosDto, UpdateInfoDto } from '../dto/heros.dto';

describe('hero', () => {
  let heorsService: HerosService;

  // tslint:disable-next-line:class-name
  class mockRepository {
    public static paginate() {
      return {};
    }
    public static findOneAndUpdate() {
      return {};
    }
    public static findOneAndRemove() {
      return {};
    }

    public save() {
      return {};
    }
  }

  mockRepository.prototype.save = () => ({});

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HerosModule]
    })
      .overrideProvider(getModelToken('Heros'))
      .useValue(mockRepository)
      .compile();

    heorsService = module.get<HerosService>(HerosService);
  });

  it('createHero', async () => {
    const obj = {
      ip: '95.179.198.236'
    } as HerosInfoDto & { ip: string };
    const res = await heorsService.createHero(obj);
    expect(res).toMatchObject(new mockRepository().save());
  });

  it('searchHero', async () => {
    const obj = {} as QueryHerosDto;
    const res = await heorsService.searchHero(obj);
    expect(res).toMatchObject(mockRepository.paginate());
  });

  it('updateHero', async () => {
    const obj = {} as UpdateInfoDto;
    const res = await heorsService.updateHero(obj);
    expect(res).toMatchObject({});
  });

  it('deleteHero', async () => {
    const res = await heorsService.deleteHero('12345');
    expect(res).toMatchObject({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
