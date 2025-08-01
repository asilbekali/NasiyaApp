import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/Guards/auth.guard';

@Controller('debtor')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDebtorDto: CreateDebtorDto, @Req() req: Request) {
    return this.debtorService.create(createDebtorDto, req);
  }

  // @RoleDec(Role.ADMIN, Role.SELLER)
  // @UseGuards(RolesGuard)
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.debtorService.findAll();
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtorService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
    return this.debtorService.update(+id, updateDebtorDto);
  }

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtorService.remove(+id);
  }
}
