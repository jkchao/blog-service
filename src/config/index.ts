import Joi from 'joi';
import fs from 'fs';
import dotenv from 'dotenv';
import { ConflictException } from '@nestjs/common';
import path from 'path';
import { AxiosRequestConfig } from 'axios';
import { Configuration } from 'log4js';

const LOGO = `
        ......................................&&.........................
        ....................................&&&..........................
        .................................&&&&............................
        ...............................&&&&..............................
        .............................&&&&&&..............................
        ...........................&&&&&&....&&&..&&&&&&&&&&&&&&&........
        ..................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&..............
        ................&...&&&&&&&&&&&&&&&&&&&&&&&&&&&&.................
        .......................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.........
        ...................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...............
        ..................&&&   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&............
        ...............&&&&&@  &&&&&&&&&&..&&&&&&&&&&&&&&&&&&&...........
        ..............&&&&&&&&&&&&&&&.&&....&&&&&&&&&&&&&..&&&&&.........
        ..........&&&&&&&&&&&&&&&&&&...&.....&&&&&&&&&&&&&...&&&&........
        ........&&&&&&&&&&&&&&&&&&&.........&&&&&&&&&&&&&&&....&&&.......
        .......&&&&&&&&.....................&&&&&&&&&&&&&&&&.....&&......
        ........&&&&&.....................&&&&&&&&&&&&&&&&&&.............
        ..........&...................&&&&&&&&&&&&&&&&&&&&&&&............
        ................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&............
        ..................&&&&&&&&&&&&&&&&&&&&&&&&&&&&..&&&&&............
        ..............&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&....&&&&&............
        ...........&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&......&&&&............
        .........&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.........&&&&............
        .......&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...........&&&&............
        ......&&&&&&&&&&&&&&&&&&&...&&&&&&...............&&&.............
        .....&&&&&&&&&&&&&&&&............................&&..............
        ....&&&&&&&&&&&&&&&.................&&...........................
        ...&&&&&&&&&&&&&&&.....................&&&&......................
        ...&&&&&&&&&&.&&&........................&&&&&...................
        ..&&&&&&&&&&&..&&..........................&&&&&&&...............
        ..&&&&&&&&&&&&...&............&&&.....&&&&...&&&&&&&.............
        ..&&&&&&&&&&&&&.................&&&.....&&&&&&&&&&&&&&...........
        ..&&&&&&&&&&&&&&&&..............&&&&&&&&&&&&&&&&&&&&&&&&.........
        ..&&.&&&&&&&&&&&&&&&&&.........&&&&&&&&&&&&&&&&&&&&&&&&&&&.......
        ...&&..&&&&&&&&&&&&.........&&&&&&&&&&&&&&&&...&&&&&&&&&&&&......
        ....&..&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...........&&&&&&&&.....
        .......&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&..............&&&&&&&....
        .......&&&&&.&&&&&&&&&&&&&&&&&&..&&&&&&&&...&..........&&&&&&....
        ........&&&.....&&&&&&&&&&&&&.....&&&&&&&&&&...........&..&&&&...
        .......&&&........&&&.&&&&&&&&&.....&&&&&.................&&&&...
        .......&&&...............&&&&&&&.......&&&&&&&&............&&&...
        ........&&...................&&&&&&.........................&&&..
        .........&.....................&&&&........................&&....
        ...............................&&&.......................&&......
        ................................&&......................&&.......
        .................................&&..............................
        ..................................&..............................
`;

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      APP_NAME: Joi.string().required(),
      APP_PATH: Joi.string().required(),
      APP_PORT: Joi.number().required(),
      APP_LIMIT: Joi.number().required(),

      LOG_PATH: Joi.string().required(),
      LOG_LEVEL: Joi.string().required(),

      EMAIL_HOST: Joi.string().required(),
      EMAIL_ACCOUNT: Joi.string().required(),
      EMAIL_PASSWORD: Joi.string().required(),

      QINNIU_ACCESSKEY: Joi.string().required(),
      QINNIU_TOKEN: Joi.string().required(),
      QINNIU_BUCKET: Joi.string().required(),

      BAIDU_SITE: Joi.string().required(),
      BAIDU_TOKEN: Joi.string().required(),

      MONGO_URL: Joi.string().required(),

      JWTKEY: Joi.string().required(),
      DEFAULT_USERNAME: Joi.string().required(),
      DEFAULT_PASSWORD: Joi.string().required(),

      NODE_ENV: Joi.string().required()
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);
    if (error) {
      throw new ConflictException(`Config validation`);
    }
    return validatedEnvConfig;
  }

  public get APP_NAME() {
    return this.envConfig.APP_NAME;
  }
  public get APP_PORT(): number {
    return Number(this.envConfig.APP_PORT);
  }
  public get APP_PATH(): string {
    return this.envConfig.APP_PATH;
  }
  public get APP_LIMIT(): number {
    return Number(this.envConfig.APP_LIMIT);
  }

  public get LOG_PATH(): string {
    return this.envConfig.LOG_PATH;
  }
  public get LOG_LEVEL(): string {
    return this.envConfig.LOG_LEVEL;
  }

  public get EMAIL_HOST(): string {
    return this.envConfig.EMAIL_HOST;
  }
  public get EMAIL_ACCOUNT(): string {
    return this.envConfig.EMAIL_ACCOUNT;
  }
  public get EMAIL_PASSWORD(): string {
    return this.envConfig.EMAIL_PASSWORD;
  }

  public get QINNIU_ACCESSKEY(): string {
    return this.envConfig.QINNIU_ACCESSKEY;
  }
  public get QINNIU_TOKEN(): string {
    return this.envConfig.QINNIU_TOKEN;
  }
  public get QINNIU_BUCKET(): string {
    return this.envConfig.QINNIU_BUCKET;
  }

  public get BAIDU_SITE(): string {
    return this.envConfig.BAIDU_SITE;
  }
  public get BAIDU_TOKEN(): string {
    return this.envConfig.BAIDU_TOKEN;
  }

  public get MONGO_URL(): string {
    return this.envConfig.MONGO_URL;
  }

  public get JWTKEY(): string {
    return this.envConfig.JWTKEY;
  }
  public get DEFAULT_USERNAME(): string {
    return this.envConfig.DEFAULT_USERNAME;
  }
  public get DEFAULT_PASSWORD(): string {
    return this.envConfig.DEFAULT_PASSWORD;
  }

  public get LOG4CONFI(): Configuration {
    return {
      appenders: {
        out: { type: 'console' },
        app: {
          type: 'dateFile',
          filename: path.join(this.LOG_PATH, 'BLOG_LOGGER'),
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
          appender: {
            type: 'console'
          }
        }
      },
      categories: {
        default: {
          appenders: ['out', 'app'],
          level: this.LOG_LEVEL
        }
      }
    };
  }
  public get AXIOS_CONFIG(): AxiosRequestConfig {
    return {
      baseURL: this.APP_PATH,
      timeout: 5000
    };
  }
  public get APP_INFO() {
    return {
      name: 'by_blog',
      version: '1.0.0',
      author: 'jkchao',
      site: 'https://jkchao.cn',
      powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
    };
  }
  public get ENV() {
    return this.envConfig.NODE_ENV;
  }
}

const config = new ConfigService(path.resolve(__dirname, `${process.env.NODE_ENV}.env`));

export { config };
