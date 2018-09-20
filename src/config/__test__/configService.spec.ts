import { ConfigService } from '../index';
import path from 'path';

describe('HttpService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    // configService = new ConfigService('../test.env');
  });

  it('all config', () => {
    configService = new ConfigService(path.resolve(process.cwd(), `src/config/test.env`));

    expect(configService.APPNAME).toBe('Blog');
    expect(configService.PORT).toBe(8000);
    expect(configService.ENV).toBe('test');
    expect(configService.JWTKEY).toBe('BlogJWT');
    expect(configService.API).toBe('http://mock.fe.vipabc.com/mock/5b9a244b99b0224e7d062190');
    expect(configService.AXIOS_CONFIG).toMatchObject({
      baseURL: 'http://mock.fe.vipabc.com/mock/5b9a244b99b0224e7d062190',
      timeout: 5000
    });
    expect(configService.LOG4CONFI).toMatchObject({
      appenders: {
        out: { type: 'console' },
        app: {
          type: 'dateFile',
          filename: path.join(configService.LOGS_PATH, 'CMS_LOGGER'),
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
          level: configService.LOG_LEVEL || 'info'
        }
      }
    });
  });

  it('thorw error', () => {
    // configService = new ConfigService(path.resolve(process.cwd(), `src/config/testError.env`));
    function test() {
      new ConfigService(path.resolve(process.cwd(), `src/config/testError.env`));
    }

    expect(test).toThrow();
  });
});
