import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Invoice } from './entities/invoice.entity';
@ApiTags('invoices')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create an invoice' })
  @ApiResponse({
    status: 201,
    description: 'The invoice has been successfully created.',
  })
  @ApiBody({ type: CreateInvoiceDto })
  create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<number> {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':invoiceNumber')
  @ApiOperation({ summary: 'Find an invoice by its invoice number' })
  @ApiParam({ name: 'invoiceNumber', description: 'The invoice number' })
  @ApiResponse({
    status: 200,
    description: 'The invoice has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoiceService.findByInvoiceNumber(invoiceNumber);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get invoices by business ID' })
  @ApiOkResponse({
    description: 'List of invoices for the given business ID',
    type: [Invoice],
  })
  @ApiBadRequestResponse({
    description: 'Failed to get invoices by business ID',
  })
  async getInvoiceByBusinessId(
    @Param('businessId') businessId: number,
  ): Promise<Invoice[]> {
    return this.invoiceService.getInvoiceByBusinessId(businessId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
  //   return this.invoiceService.update(+id, updateInvoiceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.invoiceService.remove(+id);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.invoiceService.findOne(+id);
  // }
}
