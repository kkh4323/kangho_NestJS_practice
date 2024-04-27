import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from './guardies/local-auth.guard';
import { RequestWithUserInterface } from './interfaces/requestWithUser.interface';
import { JwtAuthGuard } from './guardies/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('/signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signinUser(createUserDto);
  }
  // 로그인
  @Post('/login')
  // async loggedInUser(@Body() loginUserDto: LoginUserDto) {
  //   return await this.authService.loginUser(loginUserDto);
  // }
  @UseGuards(LocalAuthGuard)
  async loggedInUser(@Req() req: RequestWithUserInterface) {
    const user = await req.user;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfoByToken(@Req() req: RequestWithUserInterface) {
    return req.user;
  }
}
