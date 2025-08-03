import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentSectionDto } from './create-payment-section.dto';

export class UpdatePaymentSectionDto extends PartialType(CreatePaymentSectionDto) {}
