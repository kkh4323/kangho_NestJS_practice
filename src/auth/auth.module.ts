import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import { EmailModule } from '@email/email.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { LocalAuthStrategy } from '@auth/strategies/local-auth.strategy';
import { JwtAuthStrategy } from '@auth/strategies/jwt-auth.strategy';
import { GoogleAuthStrategy } from '@auth/strategies/google-auth.strategy';
import { KakaoAuthStrategy } from '@auth/strategies/kakao-auth.strategy';
import { NaverAuthStrategy } from '@auth/strategies/naver-auth.strategy';
import { RefreshTokenStrategy } from '@auth/strategies/refresh-token-strategy';
import { AgreeOfTermModule } from '@agree-of-term/agree-of-term.module';

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
