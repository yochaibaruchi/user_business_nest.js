import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNewPasswordConfirmed } from '../is-password-match.validator';

export class AuthResetPasswordConfirmDto {
  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail({}, { message: 'The email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Confirmation code sent to the user' })
  @IsString()
  @IsNotEmpty()
  confirmationCode: string;

  @ApiProperty({
    description:
      'New password (minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character)',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  newPassword: string;

  @ApiProperty({
    description: 'The password confirmation.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  confirmPassword: string;

  @Validate(IsNewPasswordConfirmed)
  matchingPasswords: Boolean;
}
