import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-sen-message-debtor.dto';

export class UpdateSenMessageDebtorDto extends PartialType(CreateMessageDto) {}
