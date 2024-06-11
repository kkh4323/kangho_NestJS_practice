import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserInfoDto {
  @ApiProperty({ example: '19970408' })
  @IsNumber()
  birthday: number;

  @ApiProperty()
  @IsNumber()
  age?: number;

  @ApiProperty({ example: 'HUFS' })
  @IsString()
  graduated: string;
}
