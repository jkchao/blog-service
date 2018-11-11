import { Module, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolvers';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { AuthSchema } from './schema/auth.schema';
import { Model } from 'mongoose';
import { AuthInterface } from './interface/auth.interface';
import { config } from '../../config';
import { md5Decode } from '../../common/utils';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }])],
  providers: [AuthService, AuthResolvers]
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    @InjectModel('Auth') private readonly authModel: Model<AuthInterface>
  ) {}

  /**
   * 初始化创建用户
   */
  private async initUser() {
    const auth = await this.authService.findOne(config.DEFAULT_USERNAME);
    if (!auth) {
      const password = md5Decode(config.DEFAULT_PASSWORD);

      try {
        await this.authModel.create({
          username: config.DEFAULT_USERNAME,
          password
        });
      } catch (error) {
        throw new InternalServerErrorException('初始化用户失败');
      }
    }
  }

  public async onModuleInit() {
    await this.initUser();
  }
}
