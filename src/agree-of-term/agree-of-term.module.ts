import { Module } from '@nestjs/common';
import { AgreeOfTermService } from './agree-of-term.service';
import { AgreeOfTermController } from './agree-of-term.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreeOfTerm } from './entities/agree-of-term.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AgreeOfTerm]), UserModule],
  controllers: [AgreeOfTermController],
  providers: [AgreeOfTermService],
})
export class AgreeOfTermModule {}
