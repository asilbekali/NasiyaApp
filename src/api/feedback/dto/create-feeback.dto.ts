import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'Xizmatdan juda mamnunman!',
    description: 'Foydalanuvchi tomonidan qoldirilgan izoh',
  })
  @IsString()
  message: string;
}
