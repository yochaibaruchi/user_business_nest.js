import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class NewPasswordRequiredDto {
  @ApiProperty({
    description:
      'The session returned by Cognito when a new password is required.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  session: string;

  @ApiProperty({
    description: "The user's email.",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The new password for the user.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  newPassword: string;
}
