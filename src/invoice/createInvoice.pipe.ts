import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class ParseInvoicesPipe implements PipeTransform {
  transform(value: string): CreateInvoiceDto[] {
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new BadRequestException('Invalid invoice data');
    }
  }
}
