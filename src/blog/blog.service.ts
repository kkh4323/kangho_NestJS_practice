import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  // 전체 블로그 데이터 가져오는 로직
  async getBlogDatas() {
    return await this.blogRepository.find({});
  }

  // 상세 블로그 데이터 가져오는 로직
  async getBlogById(id: string) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException();
    return blog;
  }

  // 블로그 등록하는 로직
  async createBlog(createBlogDto: CreateBlogDto) {
    const newBlog = await this.blogRepository.create(createBlogDto);
    await this.blogRepository.save(newBlog);
    return newBlog;
  }

  // 블로그 수정하는 로직
  async updateBlogById(id: string, updateBlogDto: CreateBlogDto) {
    const blog = await this.blogRepository.update(id, updateBlogDto);
    if (blog.affected) return 'updated';
  }

  // 블로그 삭제하는 로직
  async deleteBlogById(id: string) {
    const result = await this.blogRepository.delete({ id });
    if (result.affected) return `${id} delete success`;
  }
}
