import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleGuard } from '../auth/guardies/role.guard';
import { Role } from './entities/role.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 전체 유저 정보 가져오는 api
  @Get()
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseGuards()
  async getUserDatas() {
    return await this.userService.getUserDatas();
  }

  // 상세 유저 정보 가져오는 api
  @Get('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }
}
