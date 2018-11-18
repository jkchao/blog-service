import axios from 'axios';
import { Module, Global } from '@nestjs/common';
import { HttpService } from './http.service';
import { AXIOS_TOKEN } from './http.constants';
import { config } from '../../../config';

@Global()
@Module({
  providers: [
    HttpService,
    {
      provide: AXIOS_TOKEN,
      useValue: axios.create(config.AXIOS_CONFIG)
    }
  ],
  exports: [HttpService]
})
export class HttpModule {}
