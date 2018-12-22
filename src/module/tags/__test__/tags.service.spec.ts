import { Test } from '@nestjs/testing';

import { TagsModule } from '../tags.module';
import { TagsService } from '../tags.service';
import { getModelToken } from '@nestjs/mongoose';

import mongoose from 'mongoose';
import { ArticlesSercice } from '../../articles/articles.service';
import { CreateTagDto, TagInfoDto, QueryTagsDto } from '../dto/tag.dto';

describe('tag', () => {
  let tagsService: TagsService;

  // tslint:disable-next-line:class-name
  class mockRepository {
    public static paginate() {
      return {
        docs: [{ _id: '123' }]
      };
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
      imports: [TagsModule]
    })
      .overrideProvider(getModelToken('Tags'))
      .useValue(mockRepository)
      .overrideProvider(getModelToken('Articles'))
      .useValue({})
      .overrideProvider(ArticlesSercice)
      .useValue({
        aggregate() {
          return [
            {
              _id: '123'
            }
          ];
        }
      })
      .compile();

    tagsService = module.get<TagsService>(TagsService);
  });

  it('createTag', async () => {
    const obj = {} as CreateTagDto;
    const res = await tagsService.createTag(obj);
    expect(res).toMatchObject(new mockRepository().save());
  });

  it('sortTag', async () => {
    const res = await tagsService.sortTag(['1', '2']);
    expect(res);
  });

  it('updateTag', async () => {
    const obj = {} as TagInfoDto;
    const res = await tagsService.updateTag(obj);
    expect(res).toMatchObject({});
  });

  it('searchTags', async () => {
    const obj = {} as QueryTagsDto;
    const res = await tagsService.searchTags(obj, true);
    expect(res).toMatchObject({});
  });

  it('deleteTag', async () => {
    const res = await tagsService.deleteTag('12345');
    expect(res).toMatchObject({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
