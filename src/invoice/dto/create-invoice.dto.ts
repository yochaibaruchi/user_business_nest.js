import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceType } from '../entities/invoice.entity';

// export class CreateInvoiceDtoJson {
//   @ApiProperty({
//     description: 'The invoice number. This field is required.',
//     required: true,
//   })
//   @IsNotEmpty()
//   @IsString()
//   invoiceNumber: string;

//   @ApiProperty({
//     description: 'The invoice amount. This field is required.',
//     required: true,
//   })
//   @IsNotEmpty()
//   @IsNumber({ maxDecimalPlaces: 2 })
//   sum: number;

//   @ApiProperty({
//     description: 'The due date. This field is required.',
//     required: true,
//   })
//   @IsNotEmpty()
//   @IsDateString()
//   issueDate: Date;

//   [key: string]: unknown;
// }

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'the related business id',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  businessId: number;

  @ApiProperty({
    description:
      'The type of the invoice (income or expense). This field is required.',
    required: true,
    enum: InvoiceType,
    enumName: 'InvoiceType',
  })
  @IsNotEmpty()
  @IsEnum(InvoiceType)
  invoiceType: InvoiceType;

  @ApiProperty({
    description: 'The invoice number. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    description: 'The client name. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  clientName: String;

  @ApiProperty({
    description: 'The invoice amount. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  sum: number;

  @ApiProperty({
    description: 'The due date. This field is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  issueDate: Date;

  @ApiProperty({
    description: 'the item name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  item: string;

  @ApiProperty({
    description: 'the sum currency',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'the s3 image file name and key',
    required: true,
  })
  @IsOptional()
  @IsString()
  imagePath: string;

  // @ApiProperty({
  //   description: 'the json data',
  //   required: true,
  //   type: CreateInvoiceDtoJson,
  // })
  // @IsNotEmpty()
  // data: CreateInvoiceDtoJson;

  @ApiProperty({
    description: 'The email address. This field is optional.',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'The phone number. This field is optional.',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
