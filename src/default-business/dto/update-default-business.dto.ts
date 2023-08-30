import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDefaultBusinessDto } from './create-default-business.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDefaultBusinessDto {
  @ApiProperty({
    description: 'The ID of the the new  default Business of a user.',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  businessId: number;
}
