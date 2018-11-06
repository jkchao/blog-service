import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { BlogLogger } from './common/extends/logger';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AuthIsVerifiedGuard } from './common/guards/AuthIsVerifiedGuard';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from './config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new BlogLogger()
  });
  const logger = new Logger();

  logger.log(config.APP_NAME + ' start...');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor(), new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalGuards(new AuthIsVerifiedGuard());

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
    logger.log(config.APP_NAME + 'start: 0.0.0.0:' + config.APP_PORT);
  });
}

bootstrap();
