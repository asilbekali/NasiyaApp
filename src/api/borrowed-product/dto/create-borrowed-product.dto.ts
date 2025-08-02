import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateBorrowedProductDto {
  @ApiProperty({ example: 'Laptop' })
  @IsString()
  productName: string;

  @ApiProperty({ example: '2025-08-01' })
  @IsDateString()
  term: string;

  @ApiProperty({ example: 15000000 })
  @IsInt()
  totalAmount: number;

  @ApiProperty({ example: 'Urgent borrow' })
  @IsString()
  note: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  debtorId: number;
}
