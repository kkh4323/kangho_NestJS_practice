import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { EmailService } from '../email/email.service';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Provider } from '../user/entities/provider.enum';
import { User } from '../user/entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { VerifyEmailDto } from '../user/dto/verify-email.dto';
import { EmailUserDto } from '../user/dto/email-user.dto';

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
    console.log(loginUserDto);
    const isPasswordMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException('password do not match', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECURITY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    // return token;
    return `Authentication=${token}; Path=/; Max-Age=${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }

  public genarateRefreshToken(userId: string): {
    token: string;
    cookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECURITY'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    // return token;
    const cookie = `Refresh=${token}; Path=/; Max-Age=${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return { cookie, token };
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
}
