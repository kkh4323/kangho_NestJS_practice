import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgreeOfTerm } from './entities/agree-of-term.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateAgreeOfTermDto } from './dto/create-agree-of-term.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AgreeOfTermService {
  constructor(
    @InjectRepository(AgreeOfTerm)
    private agreeOfTermRepository: Repository<AgreeOfTerm>,
    private readonly userService: UserService,
  ) {}

  async createAgreeOfTerm(
    user: User,
    createAgreeOfTermDto: CreateAgreeOfTermDto,
  ) {
    const newAgreeOfTerm = await this.agreeOfTermRepository.create({
      ...createAgreeOfTermDto,
      user,
    });
    await this.agreeOfTermRepository.save(newAgreeOfTerm);
    return newAgreeOfTerm;
  }

  async updateAgreeOfTerm(
    user: User,
    updateAgreeOfTermDto: CreateAgreeOfTermDto,
  ) {
    const existedUser = await this.userService.getUserByEmail(user.email);
    // const existedAgreeOfTerm = await this.agreeOfTermRepository.findOneBy({id: existedUser.})
    return await this.agreeOfTermRepository.update(
      { id: existedUser.agreeOfTerm.id },
      updateAgreeOfTermDto,
    );
  }
}
