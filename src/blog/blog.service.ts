import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '@blog/entities/blog.entity';
import { CreateBlogDto } from '@blog/dto/create-blog.dto';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { PageMetaDto } from '@common/dtos/page-meta.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  // 전체 블로그 데이터 가져오는 로직
  async getBlogDatas(pageOptionsDto: PageOptionsDto): Promise<PageDto<Blog>> {
    // return await this.blogRepository.find({});
    const queryBuilder = this.blogRepository.createQueryBuilder('blog');
    queryBuilder
      .orderBy('blog.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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
