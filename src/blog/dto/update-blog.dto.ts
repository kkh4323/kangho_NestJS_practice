import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from '@blog/dto/create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
