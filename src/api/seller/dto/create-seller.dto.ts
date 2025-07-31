import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  image: string;
}
