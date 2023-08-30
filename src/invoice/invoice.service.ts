import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityNotFoundError,
  InsertResult,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async createInvoice(
    createInvoiceDto: CreateInvoiceDto[],
  ): Promise<ObjectLiteral[]> {
    const insertInput = createInvoiceDto.map(({ businessId, ...rest }) => ({
      ...rest,
      business: { businessId },
    }));

    try {
      const result = await this.invoiceRepository
        .createQueryBuilder()
        .insert()
        .into(Invoice)
        .values(insertInput)
        .execute();

      return result.generatedMaps;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'An invoice with the same invoice number already exists.',
        );
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException(`Business not found.`);
      }
      throw new BadRequestException(
        'Failed to create invoice: ' + error.message,
      );
    }
  }

  async findAll() {
    return await this.invoiceRepository.find();
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    try {
      return await this.invoiceRepository.findOneByOrFail({
        invoiceNumber: invoiceNumber,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          `invoice with number ${invoiceNumber} was not found`,
        );
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  async getInvoiceByBusinessId(businessId: number): Promise<Invoice[]> {
    try {
      const invoices: Invoice[] = await this.invoiceRepository.find({
        where: { business: { businessId } },
      });
      return invoices;
    } catch (error) {
      throw new BadRequestException(
        'Failed to get invoices by business id: ' + error.message,
      );
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} invoice`;
  // }

  // update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
  //   return `This action updates a #${id} invoice`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} invoice`;
  // }

  async getUserDefaultInvoices(userId: string) {
    try {
      const invoices = await this.invoiceRepository
        .createQueryBuilder('invoices')
        .select([
          'business.id as businessId',
          'invoices.invoiceType',
          'invoices.currency',
          'invoices.sum',
          'invoices.item',
        ])
        .leftJoin('invoices.business', 'business')
        .innerJoin('business.defaultBusiness', 'defaultBusiness')
        .where('defaultBusiness.userId = :userId', { userId })
        .getRawMany();
      return invoices;
    } catch (error) {
      throw new BadRequestException(
        'Failed to get default invoices by user id: ' + error.message,
      );
    }
  }
}
