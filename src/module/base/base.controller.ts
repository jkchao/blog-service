import { HttpStatus, HttpException } from '@nestjs/common';

export class BaseController {
  public handleSucces(data: any = '', code = 1, message = '请求数据成功') {
    return { data, code, message };
  }

  public handleError(message = '系统内部错误', code: HttpStatus = 400) {
    throw new HttpException(message, code);
  }
}
