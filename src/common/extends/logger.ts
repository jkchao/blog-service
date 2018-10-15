import { LoggerService } from '@nestjs/common';
import log4js, { Logger } from 'log4js';
import { config } from '../../config';

export class BlogLogger implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    log4js.configure(config.LOG4CONFI);
    this.logger = log4js.getLogger(`${config.APP_NAME}: APP`);
  }

  public error(message: string, trace: string) {
    this.logger.error(message);
  }
  public log(message: string) {
    this.logger.info(message);
  }
  public warn(message: string) {
    this.logger.warn(message);
  }
}
