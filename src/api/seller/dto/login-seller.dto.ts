import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginSellerDto {
  @ApiProperty({ example: 'gani@gmail.com', description: 'Seller email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'gani123', description: 'Seller password' })
  @IsString()
  @MinLength(6)
  password: string;
}
