import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BorrowedProductService } from './borrowed-product.service';
import { CreateBorrowedProductDto } from './dto/create-borrowed-product.dto';
import { UpdateBorrowedProductDto } from './dto/update-borrowed-product.dto';

@Controller('borrowed-product')
export class BorrowedProductController {
  constructor(private readonly borrowedProductService: BorrowedProductService) {}

  @Post()
  create(@Body() createBorrowedProductDto: CreateBorrowedProductDto) {
    return this.borrowedProductService.create(createBorrowedProductDto);
  }

  @Get()
  findAll() {
    return this.borrowedProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowedProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowedProductDto: UpdateBorrowedProductDto) {
    return this.borrowedProductService.update(+id, updateBorrowedProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowedProductService.remove(+id);
  }
}
