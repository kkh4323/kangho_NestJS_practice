import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { GoogleAuthStrategy } from './strategies/google-auth.strategy';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';
import { NaverAuthStrategy } from './strategies/naver-auth.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';

@Module({
  imports: [UserModule, EmailModule, JwtModule.register({}), ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthStrategy,
    JwtAuthStrategy,
    GoogleAuthStrategy,
    KakaoAuthStrategy,
    NaverAuthStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
