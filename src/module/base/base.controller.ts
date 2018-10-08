import { HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

export class BaseController {
  public handleSucces(res: Response, data: any = '', code = 200, message = '请求数据成功') {
    return res.status(code).jsonp(data);
  }

  public handleError(message = '系统内部错误', code: HttpStatus = 400) {
    throw new HttpException(message, code);
  }
}
