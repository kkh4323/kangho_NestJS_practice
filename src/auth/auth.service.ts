import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
}
