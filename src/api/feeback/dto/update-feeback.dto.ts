import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackDto } from './create-feeback.dto';

export class UpdateFeebackDto extends PartialType(CreateFeedbackDto) {}
