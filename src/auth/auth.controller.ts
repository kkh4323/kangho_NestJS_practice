import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from './guardies/local-auth.guard';
import { RequestWithUserInterface } from './interfaces/requestWithUser.interface';
import { JwtAuthGuard } from './guardies/jwt-auth.guard';
import { GoogleAuthGuard } from './guardies/google-auth.guard';
import { KakaoAuthGuard } from './guardies/kakao-auth.guard';
import { NaverAuthGuard } from './guardies/naver-auth.guard';
import { VerifyEmailDto } from '../user/dto/verify-email.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailUserDto } from '../user/dto/email-user.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('/signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signinUser(createUserDto);
  }

  // 이메일 전송
  @Post('/email/send')
  @ApiBody({ type: EmailUserDto })
  async sendEmail(@Body() emailUserDto: EmailUserDto) {
    return await this.authService.sendEmail(emailUserDto);
  }

  // 인증코드 비교
  @Post('/email/verify')
  async verifyEmailWithCode(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  // 로그인
  @Post('/login')
  // async loggedInUser(@Body() loginUserDto: LoginUserDto) {
  //   return await this.authService.loginUser(loginUserDto);
  // }
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async loggedInUser(
    @Req() req: RequestWithUserInterface,
    @Res() response: Response,
  ) {
    const user = await req.user;
    const accessTokenCookie = await this.authService.generateAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      await this.authService.genarateRefreshToken(user.id);
    // return { user, accessToken, refreshToken };
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    response.send(user);
  }

  // @Get('/refresh')
  // async refresh() {
  //
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req: RequestWithUserInterface) {
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
    return true;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserInfoByToken(@Req() req: RequestWithUserInterface) {
    return req.user;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: RequestWithUserInterface,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.authService.changePassword(req.user, newPassword);
  }

  @HttpCode(200)
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  @HttpCode(200)
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @HttpCode(200)
  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @HttpCode(200)
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallback(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @HttpCode(200)
  @Get('/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return HttpStatus.OK;
  }

  @HttpCode(200)
  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }
}
