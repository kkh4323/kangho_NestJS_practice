import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    // console.log(profile);
    // done(null, profile);
    const { displayName, email, provider, photos } = profile;
    // console.log(displayName, email, provider);
    // if (user && user.provider !== provider) {

    // } else if (!user) {

    // } else {
    //   done(null, user);
    // }
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
      console.log('++++++++++++++++++++++', err.status);
      if (err.status === 404) {
        const newUser = await this.userService.createUser({
          username: displayName,
          email,
          provider,
          profileImg: photos[0].value,
        });
        console.log(newUser);
        done(null, newUser);
      } else {
        done(err, null);
      }
    }
  }
}
