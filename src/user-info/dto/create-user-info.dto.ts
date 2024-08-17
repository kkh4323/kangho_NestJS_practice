import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Gender } from '@user-info/entities/gender.enum';
import { BloodType } from '@user-info/entities/bloodType.enum';
import { Drinking } from '@user-info/entities/drinking.enum';
import { BodyType } from '@user-info/entities/bodyType.enum';
import { MBTI } from '@user-info/entities/mbti.enum';
import { Graduated } from '@user-info/entities/graduated.enum';

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

  @ApiProperty({
    description: 'MBTI',
    default: MBTI.ENFP,
    enum: MBTI,
  })
  mbtiType: MBTI;

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

  @ApiProperty({
    description: 'Graduated',
    default: Graduated.College,
    enum: Graduated,
  })
  graduated: Graduated;
}
