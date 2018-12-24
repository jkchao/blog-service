import { ConfigService } from '../index';
import path from 'path';

describe('HttpService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    // configService = new ConfigService('../test.env');
  });

  it('all config', () => {
    configService = new ConfigService(path.resolve(process.cwd(), `src/config/.env.development`));

    expect(configService.APP_PORT).toBe(8000);
    expect(configService.APP_LIMIT).toBe(16);
    expect(configService.APP_PATH).toBe('/api');

    expect(configService.ENV).toBe('development');
    expect(configService.EMAIL_HOST).toBe('smtp.qq.com');
    expect(configService.QINIU_UPLOADURL).toBe('http://up.qiniu.com/');
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
  });

  it('thorw error', () => {
    // configService = new ConfigService(path.resolve(process.cwd(), `src/config/testError.env`));
    function test() {
      new ConfigService(path.resolve(process.cwd(), `src/config/.env.testError`));
    }

    expect(test).toThrow();
  });
});
