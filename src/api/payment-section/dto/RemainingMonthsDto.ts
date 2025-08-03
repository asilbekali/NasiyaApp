import { ApiProperty } from '@nestjs/swagger';

export class RemainingMonthsDto {
  @ApiProperty({
    example: 1,
    description: 'Debtor ID',
  })
  debtorId: number;

  @ApiProperty({
    example: 5,
    description: 'Borrowed Product ID',
  })
  borrowedProductId: number;
}
