import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from './entities/user-info.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserInfoDto } from './dto/create-user-info.dto';
import { UserService } from '../user/user.service';

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
    console.log(numStr);
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
