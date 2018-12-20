import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { QueryHerosDto, HerosInfoDto, UpdateInfoDto } from './dto/heros.dto';
import { HerosService } from './heros.service';
import { Request } from 'express';
import { EmailService } from '../common/email/email.service';
import { BadRequestException } from '@nestjs/common';
import { Permissions } from '@/common/decorator/Permissions.decorator';

@Resolver()
export class HerosResolver {
  constructor(private readonly herosService: HerosService, private readonly emailService: EmailService) {}

  @Query()
  public getHeros(@Args() args: QueryHerosDto, @Context('request') request: Request) {
    const token = request.headers.authorization;
    if (!token) {
      args.state = 1;
    }
    return this.herosService.searchHero(args);
  }

  @Mutation()
  @Permissions()
  public async deleteHero(@Args('_id') _id: string) {
    await this.herosService.deleteHero(_id);
    return { message: 'success' };
  }

  @Mutation()
  @Permissions()
  public async createHero(@Args('heroInfo') info: HerosInfoDto, @Context('request') request: Request) {
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
  @Permissions()
  public updateHero(@Args('heroInfo') info: UpdateInfoDto) {
    if (info.state && ![0, 1, 2].includes(info.state)) {
      throw new BadRequestException('info state should in [0, 1, 2]');
    }
    return this.herosService.updateHero(info);
  }
}
