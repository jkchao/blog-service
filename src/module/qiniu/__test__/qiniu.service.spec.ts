import { Test } from '@nestjs/testing';

import { QiniuModule } from '../qiniu.module';
import { QiniuService } from '../qiniu.service';

import qn from 'qn';

jest.mock('qn', () => {
  const create = () => {
    return {
      uploadToken() {
        return '';
      }
    };
  };
  return { create };
});

describe('options', () => {
  let qiniuService: QiniuService;

  describe('object', () => {
    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [QiniuModule]
      }).compile();
      qiniuService = module.get<QiniuService>(QiniuService);
    });

    it('getToken', async () => {
      const res = await qiniuService.getToken();
      expect(res).toMatchObject({ token: '' });
    });
  });
});
