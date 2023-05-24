import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResetPasswordRequestDto {
  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail({}, { message: 'The email must be a valid email address' })
  email: string;
}
