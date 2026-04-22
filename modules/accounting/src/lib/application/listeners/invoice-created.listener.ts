// invoice-created.listener.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccountingService } from '../services/accounting.service';

@Injectable()
export class InvoiceCreatedListener {
  private readonly logger = new Logger(InvoiceCreatedListener.name);

  constructor(private accountingService: AccountingService) {}

  @OnEvent('invoice.created')
  async handleInvoiceCreated(payload: {
    invoiceId: string;
    invoiceNumber: string;
    companyId: string;
    untaxedAmount: number;
    taxAmount: number;
    totalAmount: number;
    date: Date;
  }) {
    this.logger.log(`Processing invoice.created: ${payload.invoiceNumber}`);
    try {
      await this.accountingService.createSalesInvoiceEntry({
        companyId: payload.companyId,
        reference: payload.invoiceNumber,
        date: new Date(payload.date),
        subtotal: payload.untaxedAmount,
        taxAmount: payload.taxAmount,
        total: payload.totalAmount,
      });
    } catch (error) {
      // لو الفترة مقفولة أو مش موجودة — نسجل الخطأ بس مش نكسر الـ flow
  this.logger.error(`Failed journal entry for ${payload.invoiceNumber}:`, (error as Error).message);
    }
  }
}