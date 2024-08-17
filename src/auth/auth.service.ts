import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { UserService } from '@user/user.service';
import { EmailService } from '@email/email.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { EmailUserDto } from '@user/dto/email-user.dto';
import { VerifyEmailDto } from '@user/dto/verify-email.dto';
import { Provider } from '@user/entities/provider.enum';
import { TokenPayloadInterface } from '@auth/interfaces/tokenPayload.interface';
import { User } from '@user/entities/user.entity';
import { ChangePasswordUserDto } from '@user/dto/changePassword-user.dto';
import { AgreeOfTermService } from '@agree-of-term/agree-of-term.service';
import { CreateAgreeOfTermDto } from '@agree-of-term/dto/create-agree-of-term.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원가입
  async signinUser(createUserDto: CreateUserDto) {
    try {
      // const saltValue = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(
      //   createUserDto.password,
      //   saltValue,
      // );
      // const createdUser = await this.userService.createUser({
      //   ...createUserDto,
      //   password: hashedPassword,
      // });
      // createdUser.password = undefined;
      // return createdUser;
      const createdUser = await this.userService.createUser({
        ...createUserDto,
        provider: Provider.LOCAL,
      });
      createdUser.password = undefined;
      await this.emailService.sendMail({
        to: createUserDto.email,
        subject: 'welcome kangho world',
        text: 'welcome to kangho world',
      });
      return createdUser;
    } catch (error) {
      if (error?.code === '23505') {
        throw new HttpException(
          'user with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 로그인
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    const isPasswordMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException('password do not match', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  public generateAccessToken(userId: string): {
    accessToken: string;
    accessCookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECURITY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    // return token;
    const accessCookie = `Authentication=${accessToken}; Path=/; Max-Age=${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return { accessToken, accessCookie };
  }

  public genarateRefreshToken(userId: string): {
    refreshToken: string;
    refreshCookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECURITY'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    // return token;
    const refreshCookie = `Refresh=${refreshToken}; Path=/; Max-Age=${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return { refreshToken, refreshCookie };
  }

  public getCookiesForLogout(): string[] {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }

  async changePassword(user: User, newPassword: string) {
    const existedUser = await this.userService.getUserByEmail(user.email);
    if (existedUser.provider !== Provider.LOCAL) {
      throw new HttpException(
        'you have logged in by social ID',
        HttpStatus.NOT_ACCEPTABLE,
      );
    } else {
      return await this.userService.saveNewPassword(existedUser, newPassword);
    }
  }

  async sendEmail(emailUserDto: EmailUserDto) {
    const generateNumber = this.generateOTP();
    // 번호 저장
    await this.cacheManager.set(emailUserDto.email, generateNumber);
    await this.emailService.sendMail({
      to: emailUserDto.email,
      subject: 'Kangho App - email verification',
      text: `welcome to Kangho app, follow up this number ${generateNumber}`,
    });
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const emailCodeByRedis = await this.cacheManager.get(verifyEmailDto.email);
    if (emailCodeByRedis !== verifyEmailDto.code) {
      throw new BadRequestException('Wrong Code Provided.');
    }
    await this.cacheManager.del(verifyEmailDto.email);
    return true;
  }

  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }

  async setCurrentRefreshTokenToRedis(refreshToken: string, userId: string) {
    const saltValue = await bcrypt.genSalt(10);
    const currentHashedRefreshToken = await bcrypt.hash(
      refreshToken,
      saltValue,
    );
    await this.cacheManager.set(userId, currentHashedRefreshToken);
  }

  async deleteRefreshTokenInRedis(userId: string) {
    await this.cacheManager.del(userId);
  }

  async changePasswordByToken(changePasswordUserDto: ChangePasswordUserDto) {
    // const decodeToken = await jwtDecode(token);
    // jwtDecode는 토큰 생성 시 설정했던 만료 시간을 확인해주지 못 함.
    const { email } = await this.jwtService.verify(
      changePasswordUserDto.token,
      {
        secret: this.configService.get('FIND_PASSWORD_TOKEN_SECURITY'),
      },
    );
    // 이메일이 DB에 있는지 확인하는 로직
    const user = await this.userService.getUserByEmail(email);

    // password 변경하는 로직
    // return await this.userService.updatePassword(
    //   email,
    //   changePasswordUserDto.newPassword,
    // );
    return await this.changePassword(user, changePasswordUserDto.newPassword);
  }

  async findPasswordSendEmail(email: string) {
    const payload: any = { email };
    const user = await this.userService.getUserByEmail(email);

    if (user.provider !== Provider.LOCAL) {
      throw new HttpException(
        'you can change the password for the part you registered as a social login',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN_SECURITY'),
      expiresIn: this.configService.get('FIND_PASSWORD_TOKEN_EXPIRATION_TIME'),
    });

    const url = `${this.configService.get('EMAIL_BASE_URL')}/change/password?token=${token}`;

    await this.emailService.sendMail({
      to: email,
      subject: 'kangho find password',
      text: `비밀번호 찾기 ${url}`,
    });

    return 'sent email and please check your email';
  }
}
