/**
 * 捕获 HttpException 异常
 *
 */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

const logger = new Logger();

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const code = exception.getStatus() || '500';
    let message = exception.message || '阿西吧 Error';
    if (message.message) {
      message = message.message;
    }

    logger.error(
      JSON.stringify({
        message,
        time: new Date().toLocaleString(),
        path: request.url
      })
    );

    response.status(code).json({
      message,
      time: new Date().toLocaleString(),
      path: request.url
    });
  }
}
