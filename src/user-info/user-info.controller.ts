import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { CreateUserInfoDto } from '@user-info/dto/create-user-info.dto';
import { UserInfoService } from '@user-info/user-info.service';

@Controller('user-info')
@ApiTags('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addUserInfo(
    @Req() req: RequestWithUserInterface,
    @Body() createUserInfoDto: CreateUserInfoDto,
  ) {
    console.log(typeof createUserInfoDto.bloodType);
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
