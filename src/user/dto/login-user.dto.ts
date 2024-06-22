import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'k4k3h23@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'asdf123!' })
  @IsString()
  @MinLength(7)
  @MaxLength(15)
  // 8~16 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 :
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)
  password: string;
}
