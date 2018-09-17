import { Test, TestingModule } from '@nestjs/testing';

import { HttpModule } from '../../../common/http/http.module';
import { RedisModule } from '../../../common/redis/redis.module';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let app: TestingModule;
  let userService: UserService;
  let userController: UserController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule, RedisModule],
      controllers: [UserController],
      providers: [UserService]
    }).compile();

    userService = app.get<UserService>(UserService);
    userController = app.get<UserController>(UserController);
  });

  describe('getinfo', () => {
    it('should return success result', () => {
      const result = { code: 20000, message: '请求数据成功', result: '' };

      jest
        .spyOn(userService, 'getUserPermission')
        .mockImplementation(() => result);

      const res = userController.getInfo(
        // tslint:disable-next-line:max-line-length
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzIiwicGFzc3dvcmQiOiIxMjMiLCJleHQiOjE1MzY4MzEzMzQsImlhdCI6MTUzNjIyNjUzNH0.0vqVLdGQxEmhCaB-LqPHO5s3msoqbeyTPVfD0l8GQc4'
      );

      expect(userService.getUserPermission).toBeCalled();
      expect(res).resolves.toMatchObject({
        code: 1,
        message: '请求数据成功',
        data: ''
      });
      expect(res).rejects.toThrow('系统内部错误');
    });

    it('should throw error', () => {
      const result = { code: 0, message: '系统内部错误', result: '' };

      jest
        .spyOn(userService, 'getUserPermission')
        .mockImplementation(() => result);

      const res = userController.getInfo(
        // tslint:disable-next-line:max-line-length
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzIiwicGFzc3dvcmQiOiIxMjMiLCJleHQiOjE1MzY4MzEzMzQsImlhdCI6MTUzNjIyNjUzNH0.0vqVLdGQxEmhCaB-LqPHO5s3msoqbeyTPVfD0l8GQc4'
      );

      expect(res).rejects.toThrow('系统内部错误');
    });
  });
});
