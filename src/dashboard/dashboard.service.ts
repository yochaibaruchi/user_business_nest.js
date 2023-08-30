import { Injectable } from '@nestjs/common';
import { InvoiceService } from 'src/invoice/invoice.service';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { UserService } from 'src/user/user.service';
import { InvoiceResult } from 'src/user/dto/user-default-invoices.interface';

@Injectable()
export class DashboardService {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly userService: UserService,
  ) {}

  getDefaultDashBoard(userId: string): Promise<InvoiceResult> {
    return this.userService.getUserDefaultInvoices(userId);
  }

  async getBusinessInvoices(businessId: number): Promise<Invoice[]> {
    return this.invoiceService.getInvoiceByBusinessId(businessId);
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
