import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    description: 'Full name',
    maxLength: 50,
    type: String,
    required: false,
  })
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @ApiPropertyOptional({
    description: 'Email address',
    type: String,
    format: 'email',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @ApiPropertyOptional({
    description: 'Phone number',
    minLength: 10,
    type: String,
    required: false,
  })
  phone?: string;
}
