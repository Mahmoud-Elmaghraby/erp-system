import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccountingService } from '../services/accounting.service';

@Injectable()
export class InvoicePaidListener {
  private readonly logger = new Logger(InvoicePaidListener.name);

  constructor(private accountingService: AccountingService) {}

  @OnEvent('invoice.paid')
  async handleInvoicePaid(payload: {
    invoiceId: string;
    invoiceNumber: string;
    companyId: string;
    amount: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD';
    date: Date;
  }) {
    this.logger.log(`Processing invoice.paid: ${payload.invoiceNumber}`);
    try {
      await this.accountingService.createSalesPaymentEntry({
        companyId: payload.companyId,
        reference: `PAY-${payload.invoiceNumber}`,
        date: new Date(payload.date),
        amount: payload.amount,
        type: 'SALES',
        method: payload.paymentMethod,
      });
    } catch (error) {
      this.logger.error(
        `Failed payment entry for ${payload.invoiceNumber}:`,
        (error as Error).message,
      );
    }
  }
}