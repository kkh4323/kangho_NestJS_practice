import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateAgreeOfTermDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  overTwenty: boolean = true;

  @ApiProperty({ example: true })
  @IsBoolean()
  useTerm: boolean = true;

  @ApiProperty({ example: true })
  @IsBoolean()
  personalInfo: boolean = true;

  @ApiProperty({ example: false })
  @IsBoolean()
  agreeMarketing: boolean = false;

  @ApiProperty({ example: false })
  @IsBoolean()
  etc: boolean = false;
}
