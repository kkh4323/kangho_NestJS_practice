import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgreeOfTerm } from './entities/agree-of-term.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateAgreeOfTermDto } from './dto/create-agree-of-term.dto';

@Injectable()
export class AgreeOfTermService {
  constructor(
    @InjectRepository(AgreeOfTerm)
    private agreeOfTermRepository: Repository<AgreeOfTerm>,
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
}
