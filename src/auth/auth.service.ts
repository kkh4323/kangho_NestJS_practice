import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { EmailService } from '../email/email.service';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      const createdUser = await this.userService.createUser(createUserDto);
      createdUser.password = undefined;
      await this.emailService.sendMail({
        to: createUserDto.email,
        subject: 'welcome kangho world',
        text: 'welcome to kangho world',
      });
      return createdUser;
    } catch (error) {
      if (error?.code === 23305) {
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
    return token;
  }
}
