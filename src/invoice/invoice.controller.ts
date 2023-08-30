import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFiles,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Invoice } from './entities/invoice.entity';
import { InsertResult, ObjectLiteral } from 'typeorm';
import { FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { ParseInvoicesPipe } from './createInvoice.pipe';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';
@ApiTags('invoices')
@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file', 20))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create an invoice' })
  @ApiResponse({
    status: 201,
    description: 'The invoices has been successfully created.',
  })
  @ApiBody({
    description: 'Invoice creation data',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        createInvoiceDto: {
          type: 'array',
          items: {
            $ref: getSchemaPath(CreateInvoiceDto),
          },
        },
      },
    },
  })
  async create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
          new MaxFileSizeValidator({ maxSize: 5000000 }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body('invoices', ParseInvoicesPipe) createInvoiceDto: CreateInvoiceDto[],
  ): Promise<ObjectLiteral[]> {
    const result = await this.s3Service.upload(files);
    result.forEach((res, index) => {
      if (res.status === 'rejected') {
        createInvoiceDto[index].imagePath = null;
      }
    });
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
