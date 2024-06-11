import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from '@user-info/entities/user-info.entity';
import { UserModule } from '@user/user.module';
import { UserInfoController } from '@user-info/user-info.controller';
import { UserInfoService } from '@user-info/user-info.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), UserModule],
  controllers: [UserInfoController],
  providers: [UserInfoService],
})
export class UserInfoModule {}
