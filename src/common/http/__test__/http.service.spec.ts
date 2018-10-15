import { HttpService } from '../http.service';
import axios from 'axios';

jest.mock('axios');

describe('HttpService', () => {
  let httpService: HttpService;
  const axiosResponse = { data: {} };

  beforeEach(() => {
    httpService = new HttpService(axios);
  });

  it('mock get', () => {
    (axios.get as any).mockResolvedValue(axiosResponse);

    const res = httpService.get('/test');

    expect(res).toMatchObject({});
  });

  it('mock post', () => {
    (axios.post as any).mockResolvedValue(axiosResponse);

    const res = httpService.post('/test');

    expect(res).toMatchObject({});
  });

  it('mock patch', () => {
    (axios.patch as any).mockResolvedValue(axiosResponse);

    const res = httpService.patch('/test');

    expect(res).toMatchObject({});
  });

  it('mock delete', () => {
    (axios.delete as any).mockResolvedValue(axiosResponse);

    const res = httpService.delete('/test');

    expect(res).toMatchObject({});
  });

  it('mock put', () => {
    (axios.put as any).mockResolvedValue(axiosResponse);

    const res = httpService.put('/test');

    expect(res).toMatchObject({});
  });

  it('get instance', () => {
    const res = httpService.axiosRef;
    expect(res).toBeInstanceOf(Function);
  });
});
