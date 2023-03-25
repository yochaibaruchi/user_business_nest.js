import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ description: 'First name', maxLength: 50, type: String , required :false})
  firstName?: string;

  @IsOptional()
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ description: 'Last name', maxLength: 50, type: String, required : false })
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @ApiPropertyOptional({ description: 'Email address', type: String, format: 'email' ,  required : false })
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @ApiPropertyOptional({ description: 'Phone number', minLength: 10, type: String ,  required : false})
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'Admin status', type: Boolean,  required : false })
  isAdmin: boolean;
}
