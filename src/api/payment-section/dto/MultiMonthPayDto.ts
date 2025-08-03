import { ApiProperty } from '@nestjs/swagger';

export class MultiMonthPayDto {
  @ApiProperty({ example: 1, description: 'Debtor ID' })
  debtorId: number;

  @ApiProperty({ example: 5, description: 'Borrowed Product ID' })
  borrowedProductId: number;

  @ApiProperty({ example: 2, description: 'Number of months to pay at once' })
  monthsToPay: number;
}
