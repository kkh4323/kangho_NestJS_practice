import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager'; // 직접 추가해줘야 함.
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { User } from '@user/entities/user.entity';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { BufferedFile } from '@root/minio-client/file.model';
import { MinioClientService } from '@root/minio-client/minio-client.service';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { PageMetaDto } from '@common/dtos/page-meta.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly minioClientService: MinioClientService,
  ) {}

  // 전체 유저 정보 가져오는 로직
  async getUserDataList(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    // return await this.userRepository.find({});
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .leftJoinAndSelect('user.agreeOfTerm', 'agreeOfTerm')
      .leftJoinAndSelect('user.userInfo', 'userInfo')
      .orderBy('user.email', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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

  // 패스워드 변경
  async updatePassword(email: string, newPassword: string) {
    const user = await this.getUserByEmail(email);
    const saltValue = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltValue);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });
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

  // 유저 정보 수정하는 로직
  async updateUserById(
    user: User,
    image?: BufferedFile,
    updateUserDto?: CreateUserDto,
  ) {
    const profileImg = await this.minioClientService.uploadProfileImg(
      user,
      image,
      'profile',
    );
    return await this.userRepository.update(user.id, {
      ...updateUserDto,
      profileImg,
    });
  }
}
