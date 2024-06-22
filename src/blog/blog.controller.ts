import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from '@blog/blog.service';
import { CreateBlogDto } from '@blog/dto/create-blog.dto';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { Blog } from '@blog/entities/blog.entity';
import { PageDto } from '@common/dtos/page.dto';

@Controller('blog')
@ApiTags('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // 블로그 전체 데이터 가져오기
  @Get()
  async getBlogs(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Blog>> {
    return await this.blogService.getBlogDatas(pageOptionsDto);
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
