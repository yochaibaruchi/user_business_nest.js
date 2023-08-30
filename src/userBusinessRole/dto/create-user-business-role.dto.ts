import { IsNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserBusinessRoleDto {
  @ApiProperty({
    description: 'The ID of the user.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: string;

  @ApiProperty({
    description: 'The ID of the business.',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  businessId: number;

  @ApiProperty({
    description: 'The ID of the role.',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}
