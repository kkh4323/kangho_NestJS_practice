import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-google-oauth2';
import { UserService } from '@user/user.service';

@Injectable()
export class NaverAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('NAVER_AUTH_CLIENT_ID'),
      clientSecret: configService.get('NAVER_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('NAVER_AUTH_CALLBACK_URL'),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { nickname, email, provider, mobile, profileImage } = profile;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (user.provider !== provider) {
        const err = new HttpException(
          `You are already subscribed to ${user.provider}.`,
          HttpStatus.CONFLICT,
        );
        done(err, null);
      }
      done(null, user);
    } catch (err) {
      if (err.status === 404) {
        const newUser = await this.userService.createUser({
          username: nickname,
          email,
          phone: mobile,
          provider,
          profileImg: profileImage,
        });
        done(null, newUser);
      } else {
        done(err, null);
      }
    }
  }
}
