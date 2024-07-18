import { IsString } from 'class-validator';

export class ChangePasswordUserDto {
  @IsString()
  token: string;

  @IsString()
  newPassword: string;
}
