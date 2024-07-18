import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from '@user-info/entities/user-info.entity';
import { UserService } from '@user/user.service';
import { User } from '@user/entities/user.entity';
import { CreateUserInfoDto } from '@user-info/dto/create-user-info.dto';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfo)
    private userInfoRepo: Repository<UserInfo>,
    private readonly userService: UserService,
  ) {}

  async createUserInfo(user: User, createUserInfoDto: CreateUserInfoDto) {
    const newUserInfo = await this.userInfoRepo.create({
      ...createUserInfoDto,
      user,
    });
    await this.userInfoRepo.save(newUserInfo);
    return newUserInfo;
  }

  async updateUserInfo(user: User, updateUserInfoDto: CreateUserInfoDto) {
    const existedUser = await this.userService.getUserByEmail(user.email);
    const numStr = await updateUserInfoDto.birthday.toString();
    const year = parseInt(numStr.substring(0, 4));
    const month = parseInt(numStr.substring(4, 6)) - 1;
    const day = parseInt(numStr.substring(6, 8));

    const birthdayDate = new Date(year, month, day);
    const today = new Date();

    const age = today.getFullYear() - birthdayDate.getFullYear() + 1;

    updateUserInfoDto.age = age;

    return await this.userInfoRepo.update(
      { id: existedUser.userInfo.id },
      updateUserInfoDto,
    );
  }
}
