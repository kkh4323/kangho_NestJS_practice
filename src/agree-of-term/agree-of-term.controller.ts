import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AgreeOfTermService } from './agree-of-term.service';
import { CreateAgreeOfTermDto } from './dto/create-agree-of-term.dto';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';
import { JwtAuthGuard } from '../auth/guardies/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('agree-of-term')
export class AgreeOfTermController {
  constructor(private readonly agreeOfTermService: AgreeOfTermService) {}

  // 이용약관 등록
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addAgreeOfTerm(
    @Req() req: RequestWithUserInterface,
    @Body() createAgreeOfTermDto: CreateAgreeOfTermDto,
  ) {
    return await this.agreeOfTermService.createAgreeOfTerm(
      req.user,
      createAgreeOfTermDto,
    );
  }

  // 이용약관 동의사항 변경
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateAgreeOfTerm(
    @Req() req: RequestWithUserInterface,
    @Body() updateAgreeOfTermDto: CreateAgreeOfTermDto,
  ) {
    return await this.agreeOfTermService.updateAgreeOfTerm(
      req.user,
      updateAgreeOfTermDto,
    );
  }
}
