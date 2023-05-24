import { IsNotEmpty, IsString } from 'class-validator';

export class IsAdminDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  businessId: number;
}
