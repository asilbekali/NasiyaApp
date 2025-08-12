import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtorDto } from './create-debtor.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDebtorDto extends PartialType(CreateDebtorDto) {
  @ApiProperty({ example: 'Ali Valiyev', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: ['+998901234567', '+998901234568'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];

  @ApiProperty({ example: 'Toshkent, Yunusobod tuman', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Doimiy mijoz', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
