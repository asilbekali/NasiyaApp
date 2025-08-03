import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateBorrowedProductDto {
  @ApiProperty({ example: 'Televizor LG' })
  @IsString()
  productName: string;

  @ApiProperty({ example: '2025-12-31T00:00:00.000Z' })
  @IsDateString()
  term: string; 

  @ApiProperty({ example: 4000000 })
  @IsInt()
  totalAmount: number;

  @ApiProperty({ example: '3 oylik muddat' })
  @IsString()
  note: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  debtorId: number;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
