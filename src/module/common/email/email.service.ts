import { Injectable, Inject } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { EMAIL_TOKEN } from './email.constants';
import { BlogLogger } from '../logger/logger';
import { MailOptions } from 'nodemailer/lib/stream-transport';

@Injectable()
export class EmailService {
  private clientIsValid = false;

  constructor(
    private readonly loggerService: BlogLogger,
    @Inject(EMAIL_TOKEN) private readonly transporter: Transporter
  ) {}

  public verifyClient() {
    this.transporter.verify((error, success) => {
      if (error) {
        this.clientIsValid = false;
        this.loggerService.error('邮件客户端初始化连接失败，将在一小时后重试');
        setTimeout(this.verifyClient, 1000 * 60 * 60);
      } else {
        this.clientIsValid = true;
        this.loggerService.warn('邮件客户端初始化连接成功，随时可发送邮件');
      }
    });
  }

  public sendEmail(options: MailOptions) {
    if (!this.clientIsValid) {
      console.warn('由于未初始化成功，邮件客户端发送被拒绝');
      return false;
    }

    options.from = '"jkchao" <jkchao@foxmail.com>';

    this.transporter.sendMail(options, (error, info) => {
      if (error) return this.loggerService.warn('邮件发送失败');
      this.loggerService.log(
        JSON.stringify({
          message: '邮件发送成功',
          id: info.messageId,
          response: info.response
        })
      );
    });
  }
}
