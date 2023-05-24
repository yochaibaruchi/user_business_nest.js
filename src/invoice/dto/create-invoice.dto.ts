import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDtoJson {
  @ApiProperty({
    description: 'The invoice number. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    description: 'The invoice amount. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({
    description: 'The invoice date. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  invoiceDate: Date;

  @ApiProperty({
    description: 'The due date. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  [key: string]: unknown;
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'the related business id',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  businessId: number;

  @ApiProperty({
    description: 'the json data',
    required: true,
    type: CreateInvoiceDtoJson,
  })
  @IsNotEmpty()
  data: CreateInvoiceDtoJson;
}
