import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { config } from '@/config';
import { BlogLogger } from './module/common/logger/logger';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });

  const logger = app.get(BlogLogger);

  app.useLogger(logger);

  logger.log(config.APP_NAME + ' start...');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor(logger), new TimeoutInterceptor());

  app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalGuards(new AuthIsVerifiedGuard());

  // 支持 CORS
  app.enableCors({
    credentials: true
  });
  app.use(helmet());
  app.use(bodyParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100
    })
  );
  app.use(compression());

  await app.listen(config.APP_PORT, '0.0.0.0', () => {
    logger.log(config.APP_NAME + ' start: 0.0.0.0:' + config.APP_PORT);
  });
}

bootstrap();
