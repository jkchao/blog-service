import { Resolver, Query } from '@nestjs/graphql';
import { QiniuService } from './qiniu.service';

@Resolver('Qiniu')
export class QiniuResolvers {
  constructor(private readonly qiniuService: QiniuService) {}

  @Query()
  public getQiniu() {
    return this.qiniuService.getToken();
  }
}
