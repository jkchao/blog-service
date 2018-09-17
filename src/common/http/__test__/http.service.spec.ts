

import { HttpService } from '../http.service';
import axios from 'axios';
import { HttpModule } from '../http.module';


describe('HttpService', () => {
  let httpService: HttpService;

  const result = {
    data: ''
  };

  beforeEach(() => {
    httpService = new HttpService(axios);
  });


  it('get', () => {

    jest
      .spyOn(httpService.axiosRef, 'get')
      .mockImplementation(() => result);

      const res = httpService.get('/test');

      expect(res).toMatchObject(result);
  });

  // it('post', () => {

  //   jest
  //   .spyOn(httpService, 'post')
  //   .mockImplementation(() => result);

  //   const res = httpService.post('/test');

  //   expect(res).toMatchObject(result);
  // });

  // it('patch', () => {

  //   jest
  //   .spyOn(httpService, 'patch')
  //   .mockImplementation(() => result);

  //   const res = httpService.patch('/test');

  //   expect(res).toMatchObject(result);
  // });

  // it('delete', () => {

  //   jest
  //   .spyOn(httpService, 'delete')
  //   .mockImplementation(() => result);

  //   const res = httpService.delete('/test');

  //   expect(res).toMatchObject(result);
  // });

  // it('put', () => {

  //   jest
  //   .spyOn(httpService, 'put')
  //   .mockImplementation(() => result);

  //   const res = httpService.put('/test');

  //   expect(res).toMatchObject(result);
  // });
});
