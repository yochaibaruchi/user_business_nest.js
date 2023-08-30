import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDefaultBusinessDto {
  @ApiProperty({
    description: 'The ID of the the default business of a user.',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  businessId: number;

  @ApiProperty({
    description: 'The ID of the the user.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
