import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // 블로그 전체 데이터 가져오기
  @Get()
  async getBlogs() {
    return await this.blogService.getBlogDatas();
  }

  // 블로그 상세 데이터 가져오기
  @Get('/:id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogService.getBlogById(id);
  }

  // 블로그 데이터 등록
  @Post('/create')
  async creatBlog(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.createBlog(createBlogDto);
  }

  // 블로그 내용 업데이트하는 api
  @Put('/:id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogDto,
  ) {
    return await this.blogService.updateBlogById(id, updateBlogDto);
  }

  // 블로그 삭제하는 api
  @Delete('/:id')
  async deleteBlogById(@Param('id') id: string) {
    return await this.blogService.deleteBlogById(id);
  }
}
