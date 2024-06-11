import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager'; // 직접 추가해줘야 함.
import { CACHE_MANAGER } from '@nestjs/common/cache';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 전체 유저 정보 가져오는 로직
  async getUserDataList() {
    return await this.userRepository.find({});
  }

  // 유저 생성하는 로직
  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  // 이메일 검색
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException(
        'user with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  // 아이디 검색
  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  // 패스워드 저장
  async saveNewPassword(user: User, newPassword: string) {
    const existedUser = await this.userRepository.findOneBy({ id: user.id });
    const saltValue = await bcrypt.genSalt(10);
    existedUser.password = await bcrypt.hash(newPassword, saltValue);
    return await this.userRepository.save(existedUser);
  }

  // RefreshToken 매칭
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);
    const getUserIdFromRedis = await this.cacheManager.get(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      getUserIdFromRedis,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
