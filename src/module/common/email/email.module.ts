import { Module, OnModuleInit } from '@nestjs/common';
import { EmailService } from './email.service';
import { EMAIL_TOKEN } from './email.constants';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { config } from '@/config';
import { BlogLoggerModule } from '../logger/logger.module';

@Module({
  imports: [BlogLoggerModule],
  providers: [
    EmailService,
    {
      provide: EMAIL_TOKEN,
      useValue: nodemailer.createTransport(
        smtpTransport({
          host: 'smtp.qq.com',
          secure: true,
          port: 465,
          auth: {
            user: config.EMAIL_ACCOUNT,
            pass: config.EMAIL_PASSWORD
          }
        })
      )
    }
  ],
  exports: [EmailService]
})
export class EmailModule implements OnModuleInit {
  constructor(private readonly emailService: EmailService) {}

  public onModuleInit() {
    this.emailService.verifyClient();
  }
}
