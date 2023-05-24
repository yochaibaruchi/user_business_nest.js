import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class GlobalSignOutDto {
  @ApiProperty({ description: 'accsessToken ' })
  @IsString()
  accessToken: string;
}
