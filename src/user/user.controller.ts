import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from '@user/user.service';
import { RoleGuard } from '@auth/guardies/role.guard';
import { Role } from '@user/entities/role.enum';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@root/minio-client/file.model';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { User } from '@user/entities/user.entity';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 전체 유저 정보 가져오는 api
  @Get()
  @UseGuards(RoleGuard(Role.ADMIN))
  async getUserDataList(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.userService.getUserDataList(pageOptionsDto);
  }

  // 상세 유저 정보 가져오는 api
  @Get('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  // 유저 정보 수정하는 api
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @ApiBody({
    description: 'A single image file with additional member data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
      },
    },
  })
  async updateUserById(
    @Req() req: RequestWithUserInterface,
    @UploadedFile() profileImg?: BufferedFile,
    @Body() updateUserDto?: CreateUserDto,
  ) {
    return await this.userService.updateUserById(
      req.user,
      profileImg,
      updateUserDto,
    );
  }
}
