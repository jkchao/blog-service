import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userProviders } from './auth.provider';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, userProviders]
})
export class AuthModule {}
