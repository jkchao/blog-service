import { HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

export class BaseController {
  public handleSucces(res: Response, data: any = '', code = 200, message = '请求数据成功') {
    return res.status(code).jsonp({
      code,
      data,
      message,
      success: true
    });
  }

  public handleError(res: Response, message = '系统内部错误', code: HttpStatus = 200) {
    return res.status(code).jsonp({
      code,
      data: '',
      message,
      success: false
    });
  }
}
