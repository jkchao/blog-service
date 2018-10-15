import { ConfigService } from '../index';
import path from 'path';

describe('HttpService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    // configService = new ConfigService('../test.env');
  });

  it('all config', () => {
    configService = new ConfigService(path.resolve(process.cwd(), `src/config/dev.env`));

    expect(configService.APP_NAME).toBe('BLOG_SERVICE');
    expect(configService.APP_PORT).toBe(8000);
    expect(configService.APP_PATH).toBe('/api');
    expect(configService.APP_LIMIT).toBe(16);

    expect(configService.LOG_PATH).toBe('./logs');
    expect(configService.LOG_LEVEL).toBe('debug');

    expect(configService.EMAIL_HOST).toBe('smtp.qq.com');
    expect(configService.EMAIL_ACCOUNT).toBe('419027396@qq.com');
    expect(configService.EMAIL_PASSWORD).toBe('qmxnznwxfhwbbica');

    expect(configService.QINNIU_ACCESSKEY).toBe('uRYE0M3ru9g5Al1h-H1sUV6qqFKAJ4F4yPQXoLcf');
    expect(configService.QINNIU_TOKEN).toBe('_So4S5DZNYmvDezZqav7iB4Z4UZZMawKM_0Uokph');
    expect(configService.QINNIU_BUCKET).toBe('blog');

    expect(configService.BAIDU_SITE).toBe('https://jkchao.cn');
    expect(configService.BAIDU_TOKEN).toBe('phhdOEtkGgVKToH5');

    expect(configService.MONGO_URL).toBe('mongodb://blog-server:blog-server@127.0.0.1:27017/my_blog');

    expect(configService.JWTKEY).toBe('BLOGJWT');
    expect(configService.DEFAULT_USERNAME).toBe('jkchao');
    expect(configService.DEFAULT_PASSWORD).toBe('123456');
    expect(configService.ENV).toBe('dev');

    expect(configService.AXIOS_CONFIG).toMatchObject({
      baseURL: '/api',
      timeout: 5000
    });
    expect(configService.APP_INFO).toMatchObject({
      name: 'by_blog',
      version: '1.0.0',
      author: 'jkchao',
      site: 'https://jkchao.cn',
      powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
    });
    expect(configService.LOG4CONFI).toMatchObject({
      appenders: {
        out: { type: 'console' },
        app: {
          type: 'dateFile',
          filename: path.join(configService.LOG_PATH, 'BLOG_LOGGER'),
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
