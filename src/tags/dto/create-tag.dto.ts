import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'tag text',
    type: String,
  })
  text: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'tag business',
    type: Number,
  })
  businessId: Number;
}
