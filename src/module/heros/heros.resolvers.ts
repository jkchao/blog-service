import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { QueryLinksDto, InfoDto } from './dto/heros.dto';
import { HerosService } from './heros.service';
import { Info } from './decorators/heros.decorators';
import { HerosHasId, HerosQuery, Heros } from './interface/heros.interface';
import { Request } from 'express';
import { EmailService } from '../common/email/email.service';

@Resolver()
export class HerosResolver {
  constructor(private readonly herosService: HerosService, private readonly emailService: EmailService) {}

  @Query()
  public getHeros(@Args() args: HerosQuery) {
    return this.herosService.searchHero(args);
  }

  @Mutation()
  public deleteHero(@Args('_id') _id: string) {
    return this.herosService.deleteHero(_id);
  }

  @Mutation()
  public async createHero(@Info() info: Heros, @Context('request') request: Request) {
    // 获取ip地址以及物理地理地址
    const ip = ((request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.ip ||
      request.ips[0]) as string).replace('::ffff:', '');

    info.ip = ip;
    info.agent = request.headers['user-agent'] || info.agent;

    const result = await this.herosService.createHero({ ...info, ip });

    this.emailService.sendEmail({
      to: 'jkchao@foxmail.com',
      subject: '博客有新的留言墙',
      text: `来自 ${info.name} 的留言墙：${info.content}`,
      html: `<p> 来自 ${info.name} 的留言墙：${info.content}</p>`
    });

    return { name: result.name, content: result.content, message: '数据提交成功，请等待审核' };
  }

  @Mutation()
  public updateHero(@Info() info: HerosHasId) {
    return this.herosService.updateHero(info);
  }
}
