import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginSellerDto {
  @ApiProperty({ example: 'seller123', description: 'Seller name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'secret123', description: 'Seller password' })
  @IsString()
  @MinLength(6)
  password: string;
}
