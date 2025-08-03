import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 1,
    description: 'Debtor ID to whom the message will be sent',
  })
  @IsInt()
  debtorId: number;

  @ApiProperty({
    example: 'Payment reminder: Please pay your due amount.',
    description: 'Message text to send',
  })
  message: string;
}
