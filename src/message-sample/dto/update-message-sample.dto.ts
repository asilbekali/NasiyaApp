import { PartialType } from '@nestjs/swagger';
import { CreateMessageSampleDto } from './create-message-sample.dto';

export class UpdateMessageSampleDto extends PartialType(CreateMessageSampleDto) {}
