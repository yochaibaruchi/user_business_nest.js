import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [InvoiceModule, UserModule],
})
export class DashboardModule {}
