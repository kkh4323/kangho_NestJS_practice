import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { JwtAuthGuard } from '../auth/guardies/jwt-auth.guard';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';
import { CreateUserInfoDto } from './dto/create-user-info.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addUserInfo(
    @Req() req: RequestWithUserInterface,
    @Body() createUserInfoDto: CreateUserInfoDto,
  ) {
    return await this.userInfoService.createUserInfo(
      req.user,
      createUserInfoDto,
    );
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUserInfo(
    @Req() req: RequestWithUserInterface,
    @Body() updateUserInfoDto: CreateUserInfoDto,
  ) {
    return await this.userInfoService.updateUserInfo(
      req.user,
      updateUserInfoDto,
    );
  }
}
