import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentSectionDto {
  @ApiProperty({ example: 1, description: 'Debtor ID' })
  debtorId: number;

  @ApiProperty({ example: 5, description: 'Borrowed Product ID' })
  borrowedProductId: number;
}

export class PayAsYouWishDto {
  @ApiProperty({ example: 1, description: 'Debtor ID' })
  debtorId: number;

  @ApiProperty({ example: 5, description: 'Borrowed Product ID' })
  borrowedProductId: number;

  @ApiProperty({ example: 2000000, description: 'Payment Amount' })
  amount: number;
}
