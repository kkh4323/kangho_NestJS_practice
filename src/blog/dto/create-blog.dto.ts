import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'iPhone' })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'new iPhone' })
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty({ example: 1500000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'phone' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'http://localhost' })
  @IsString()
  img: string;
}
