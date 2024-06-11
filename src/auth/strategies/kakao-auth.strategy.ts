import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';

@Injectable()
export class KakaoAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('KAKAO_AUTH_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_AUTH_CALLBACK_URL'),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { username, _json, provider } = profile;
    try {
      const user = await this.userService.getUserByEmail(
        _json.kakao_account.email,
      );
      if (user.provider !== provider) {
        const err = new HttpException(
          `You are already subscribed to ${user.provider}`,
          HttpStatus.CONFLICT,
        );
        done(err, null);
      }
      done(null, user);
    } catch (err) {
      if (err.status === 404) {
        const newUser = await this.userService.createUser({
          username,
          email: _json.kakao_account.email,
          provider,
          profileImg: _json.properties.profile_image,
        });
        done(null, newUser);
      } else {
        done(err, null);
      }
    }
  }
}
