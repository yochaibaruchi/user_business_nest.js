import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmSignupDto {
  @IsEmail({}, { message: 'The email must be a valid email address' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The confirmation code received in the email',
    example: '123456',
  })
  confirmationCode: string;
}
