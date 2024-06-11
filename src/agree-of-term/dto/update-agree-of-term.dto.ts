import { PartialType } from '@nestjs/swagger';
import { CreateAgreeOfTermDto } from '@agree-of-term/dto/create-agree-of-term.dto';

export class UpdateAgreeOfTermDto extends PartialType(CreateAgreeOfTermDto) {}
