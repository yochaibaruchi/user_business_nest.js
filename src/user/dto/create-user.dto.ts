import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
// import { IsPasswordConfirmed } from '../is-password-confirmed.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique ID of the user.',
    type: String,
    required: true,
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The full name of the user.',
    maxLength: 100,
    type: String,
    required: true,
  })
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user.',
    type: String,
    format: 'email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The phone number of the user.',
    minLength: 10,
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  phone_number: string;

  @ApiProperty({
    description: 'confirmed email',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  confirmEmail?: boolean;
}
