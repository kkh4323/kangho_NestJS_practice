import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreeOfTerm } from '@agree-of-term/entities/agree-of-term.entity';
import { UserModule } from '@user/user.module';
import { AgreeOfTermController } from '@agree-of-term/agree-of-term.controller';
import { AgreeOfTermService } from '@agree-of-term/agree-of-term.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgreeOfTerm]), UserModule],
  controllers: [AgreeOfTermController],
  providers: [AgreeOfTermService],
})
export class AgreeOfTermModule {}
