import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CognitoIdTokenDto {
  @ApiProperty({
    description: 'The ID token received from AWS Cognito',
    example: 'exampleToken123456789',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
