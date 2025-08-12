import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateBorrowedProductDto } from './create-borrowed-product.dto';

export class UpdateBorrowedProductDto extends PartialType(
  CreateBorrowedProductDto,
) {
  @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
