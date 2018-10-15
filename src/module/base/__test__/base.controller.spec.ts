import { Test, TestingModule } from '@nestjs/testing';
import { BaseController } from '../base.controller';
import { Response } from 'express';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [BaseController]
    }).compile();
  });

  describe('base controller', () => {
    it('should return success"', () => {
      const res = {
        jsonp() {
          // ..
        },
        status(code) {
          expect(code).toBe(200);
          return this;
        }
      } as Response;

      const baseController = app.get<BaseController>(BaseController);
      baseController.handleSucces(res);
    });

    it('should thorw error"', () => {
      const res = {
        jsonp() {
          // ..
        },
        status(code) {
          expect(code).toBe(200);
          return this;
        }
      } as Response;
      const baseController = app.get<BaseController>(BaseController);

      baseController.handleError(res);
    });
  });
});
