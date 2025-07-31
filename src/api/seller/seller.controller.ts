import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { AuthGuard } from 'src/common/Guards/auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @RoleDec(Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  login(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.login(createSellerDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}
