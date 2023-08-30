import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'user sub' })
  sub: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;
}
