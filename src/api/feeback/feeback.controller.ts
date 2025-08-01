import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeebackService } from './feeback.service';
import { CreateFeedbackDto } from './dto/create-feeback.dto';
import { UpdateFeebackDto } from './dto/update-feeback.dto';
import { RoleDec } from 'src/common/decoratos/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/Guards/roles.guard';
import { AuthGuard } from 'src/common/Guards/auth.guard';

@Controller('feedback')
export class FeebackController {
  constructor(private readonly feebackService: FeebackService) {}

  @RoleDec(Role.ADMIN, Role.SELLER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: Request) {
    return this.feebackService.create(createFeedbackDto, req);
  }

  @Get()
  findAll() {
    return this.feebackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feebackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: CreateFeedbackDto,
  ) {
    return this.feebackService.update(+id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feebackService.remove(+id);
  }
}
