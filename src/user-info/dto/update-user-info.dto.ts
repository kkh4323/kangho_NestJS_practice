import { PartialType } from '@nestjs/swagger';
import { CreateUserInfoDto } from '@user-info/dto/create-user-info.dto';

export class UpdateUserInfoDto extends PartialType(CreateUserInfoDto) {}
