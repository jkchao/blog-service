import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolvers';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './schema/auth.schema';
import { config } from '@/config';
import { md5Decode } from '@/common/utils';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }])],
  providers: [AuthService, AuthResolvers]
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  /**
   * 初始化创建用户
   */
  private async initUser() {
    const auth = await this.authService.findOne({ username: config.DEFAULT_USERNAME });
    if (!auth) {
      const password = md5Decode(config.DEFAULT_PASSWORD);

      await this.authService.create({
        username: config.DEFAULT_USERNAME,
        password
      });
    }
  }

  public async onModuleInit() {
    await this.initUser();
  }
}
