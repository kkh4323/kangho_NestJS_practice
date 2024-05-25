import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'k4k3h23@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  code: string;
}
