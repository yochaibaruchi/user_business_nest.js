import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'user sub' })
  @IsNotEmpty({ message: 'The sub must not be empty' })
  sub: string;

  @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty({ message: 'The refresh token must not be empty' })
  refreshToken: string;
}
