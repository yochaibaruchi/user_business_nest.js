import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPasswordConfirmed } from '../is-password-match.validator';

export class AuthRegisterUserDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'The email must be a valid email address',
      context: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    },
  )
  email: string;

  /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */
  @ApiProperty({
    description:
      'Password (minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character)',
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  password: string;

  @ApiProperty({
    description: 'The password confirmation.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  confirmPassword: string;

  @Validate(IsPasswordConfirmed)
  matchingPasswords: Boolean;
}
