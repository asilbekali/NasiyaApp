import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateMessageSampleDto {
  @ApiProperty({ example: "Hello buyer, we have a new discount!", description: "Message text" })
  @IsString()
  @IsNotEmpty()
  message: string
}
