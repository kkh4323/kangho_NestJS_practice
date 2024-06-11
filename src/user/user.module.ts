import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/entities/user.entity';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';
import { MinioClientModule } from '@root/minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MinioClientModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
