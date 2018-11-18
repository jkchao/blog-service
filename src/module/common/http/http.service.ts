import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseInterface } from './http.interface';
import { AXIOS_TOKEN } from './http.constants';

@Injectable()
export class HttpService {
  constructor(@Inject(AXIOS_TOKEN) private readonly instance: AxiosInstance) {}

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ResponseInterface<T>> {
    return this.instance.get<ResponseInterface<T>>(url, config).then(res => res.data);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ResponseInterface<T>> {
    return this.instance.delete(url, config).then(res => res.data);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseInterface<T>> {
    return this.instance.post<ResponseInterface<T>>(url, data, config).then(res => res.data);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseInterface<T>> {
    return this.instance.put<ResponseInterface<T>>(url, config).then(res => res.data);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseInterface<T>> {
    return this.instance.patch<ResponseInterface<T>>(url, data, config).then(res => res.data);
  }

  get axiosRef(): AxiosInstance {
    return this.instance;
  }
}
