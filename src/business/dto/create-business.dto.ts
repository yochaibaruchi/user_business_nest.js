import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The type of the business',
    type: String,
  })
  businessType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the business',
    type: String,
  })
  businessName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The location of the business',
    type: String,
  })
  location: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The unique bank account ID of the business',
    type: String,
  })
  bankAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The bank ID of the business',
    type: Number,
  })
  bankId: number;
}
