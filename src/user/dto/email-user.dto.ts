import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailUserDto {
  @ApiProperty({ example: 'k4k3h23@gmail.com' })
  @IsEmail()
  email: string;
}
