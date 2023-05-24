import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class InitiateAuthDto {
  @ApiProperty({ description: 'Email address' })
  @IsNotEmpty({ message: 'The email must not be empty' })
  @IsEmail({}, { message: 'The email must be a valid email address' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'Password (minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character)',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  password: string;
}
