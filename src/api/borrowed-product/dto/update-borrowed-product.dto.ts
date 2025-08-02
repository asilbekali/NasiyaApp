import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowedProductDto } from './create-borrowed-product.dto';

export class UpdateBorrowedProductDto extends PartialType(
  CreateBorrowedProductDto,
) {}
