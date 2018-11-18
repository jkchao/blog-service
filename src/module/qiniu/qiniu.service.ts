import { Injectable } from '@nestjs/common';
import { config } from '@/config';
import qn from 'qn';

@Injectable()
export class QiniuService {
  public getToken() {
    const { QINNIU_ACCESSKEY, QINNIU_TOKEN, QINNIU_BUCKET, QINNIU_ORIGIN } = config;
    const client = qn.create({
      accessKey: QINNIU_ACCESSKEY,
      secretKey: QINNIU_TOKEN,
      bucket: QINNIU_BUCKET,
      origin: QINNIU_ORIGIN
    });
    return { token: client.uploadToken() };
  }
}
