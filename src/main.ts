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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new BlogLogger()
  });
  const logger = new Logger();

  logger.log(config.APPNAME + ' start...');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: config.ENV !== 'prod',
      whitelist: true,
      transform: true
    })
  );

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

  await app.listen(config.PORT, '0.0.0.0', () => {
    logger.log('Serive start: 0.0.0.0:8000');
  });
}

bootstrap();
