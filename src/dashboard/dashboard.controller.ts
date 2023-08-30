import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { InvoiceResult } from 'src/user/dto/user-default-invoices.interface';
import { CognitoAuthGuard } from 'src/cognito/guards/cognito.jwt.guard';
import { CognitoJwt } from 'src/cognito/cognito.interfaces';
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard)
  @Get()
  findDefaultInvoices(@Req() req: CognitoJwt): Promise<InvoiceResult> {
    return this.dashboardService.getDefaultDashBoard(req.user.sub);
  }

  @Get('business/:id')
  async findInvoices(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Invoice[]> {
    return this.dashboardService.getBusinessInvoices(id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dashboardService.remove(+id);
  }
}
