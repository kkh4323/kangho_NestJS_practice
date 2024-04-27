import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [UserModule, EmailModule, JwtModule.register({}), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, JwtAuthStrategy],
})
export class AuthModule {}
