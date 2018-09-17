import { Test, TestingModule } from '@nestjs/testing';
import { BaseController } from '../base.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [BaseController]
    }).compile();
  });

  describe('base controller', () => {
    it('should return success"', () => {
      const result = {
        code: 1,
        message: '请求数据成功',
        data: ''
      };

      const baseController = app.get<BaseController>(BaseController);
      expect(baseController.handleSucces()).toMatchObject(result);
    });

    it('should thorw error"', () => {
      const baseController = app.get<BaseController>(BaseController);

      function getError() {
        baseController.handleError();
      }
      expect(getError).toThrow('系统内部错误');
    });
  });
});
