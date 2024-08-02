import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { Gender } from '@user-info/entities/gender.enum';
import { BloodType } from '@user-info/entities/bloodType.enum';
import { Drinking } from '@user-info/entities/drinking.enum';
import { BodyType } from '@user-info/entities/bodyType.enum';
import { Body } from '@nestjs/common';

export class CreateUserInfoDto {
  @ApiProperty({ example: 'Korea of Republic' })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Gender',
    default: Gender.Man,
    enum: Gender,
  })
  gender: Gender;

  @ApiProperty({ example: '19970408' })
  @IsString()
  birth: string;

  @ApiProperty()
  @IsNumber()
  age?: number;

  @ApiProperty({ example: 170 })
  @IsNumber()
  height: number;

  @ApiProperty({
    description: 'BloodType',
    default: BloodType.A,
    enum: BloodType,
  })
  bloodType: BloodType;

  @ApiProperty({ example: 'ENFP' })
  @IsString()
  mbtiType: string;

  @ApiProperty({ example: 'Namyangju-si' })
  @IsString()
  addressOfHome: string;

  @ApiProperty({ example: 'Sungsu' })
  @IsString()
  activityArea: string;

  @ApiProperty({ example: 'Seoul' })
  @IsString()
  bornArea: string;

  @ApiProperty({
    description: 'BodyType',
    default: BodyType.Regular,
    enum: BodyType,
  })
  bodyType: BodyType;

  @ApiProperty({
    description: 'Drinking',
    default: Drinking.OnceAWeek,
    enum: Drinking,
  })
  drinking: Drinking;

  @ApiProperty({ example: false })
  @IsBoolean()
  smoking: boolean;

  @ApiProperty({ example: 'Hello' })
  @IsString()
  selfIntroduce: string;

  @ApiProperty({ example: 'HUFS' })
  @IsString()
  graduated: string;
}
