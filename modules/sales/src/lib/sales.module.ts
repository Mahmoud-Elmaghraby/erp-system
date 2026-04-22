import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService, RbacModule, OutboxModule, SettingsRegistry } from '@org/core';

import { CustomersController } from './presentation/controllers/customers.controller';
import { OrdersController } from './presentation/controllers/orders.controller';
import { InvoicesController } from './presentation/controllers/invoices.controller';
import { QuotationsController } from './presentation/controllers/quotations.controller';
import { DeliveriesController } from './presentation/controllers/deliveries.controller';
import { SalesReturnsController } from './presentation/controllers/sales-returns.controller';
import { SalesSettingsController } from './presentation/controllers/sales-settings.controller';

import { CreateCustomerUseCase } from './application/use-cases/customers/create-customer.use-case';
import { CreateOrderUseCase } from './application/use-cases/orders/create-order.use-case';
import { ConfirmOrderUseCase } from './application/use-cases/orders/confirm-order.use-case';
import { CreateInvoiceUseCase } from './application/use-cases/invoices/create-invoice.use-case';
import { PayInvoiceUseCase } from './application/use-cases/invoices/pay-invoice.use-case';
import { CreateQuotationUseCase } from './application/use-cases/quotations/create-quotation.use-case';
import { ConfirmQuotationUseCase } from './application/use-cases/quotations/confirm-quotation.use-case';
import { CreateDeliveryUseCase } from './application/use-cases/deliveries/create-delivery.use-case';
import { ConfirmDeliveryUseCase } from './application/use-cases/deliveries/confirm-delivery.use-case';
import { CreateSalesReturnUseCase } from './application/use-cases/sales-returns/create-sales-return.use-case';
import { ConfirmSalesReturnUseCase } from './application/use-cases/sales-returns/confirm-sales-return.use-case';
import { SalesModuleSettingsService } from './application/services/sales-module-settings.service';



import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { InvoiceRepository } from './infrastructure/repositories/invoice.repository';
import { QuotationRepository } from './infrastructure/repositories/quotation.repository';
import { DeliveryRepository } from './infrastructure/repositories/delivery.repository';
import { SalesReturnRepository } from './infrastructure/repositories/sales-return.repository';

import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository.interface';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository.interface';
import { INVOICE_REPOSITORY } from './domain/repositories/invoice.repository.interface';
import { QUOTATION_REPOSITORY } from './domain/repositories/quotation.repository.interface';
import { DELIVERY_REPOSITORY } from './domain/repositories/delivery.repository.interface';
import { SALES_RETURN_REPOSITORY } from './domain/repositories/sales-return.repository.interface';
import { salesSettingsDefinition } from './sales.settings';

@Module({
  imports: [
    RbacModule,
    OutboxModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [
    CustomersController,
    OrdersController,
    InvoicesController,
    QuotationsController,
    DeliveriesController,
    SalesReturnsController,
    SalesSettingsController,
  ],
  providers: [
    PrismaService,
    SalesModuleSettingsService,
    // Use Cases
    CreateCustomerUseCase,
    CreateOrderUseCase,
    ConfirmOrderUseCase,
    CreateInvoiceUseCase,
    PayInvoiceUseCase,
    CreateQuotationUseCase,
    ConfirmQuotationUseCase,
    CreateDeliveryUseCase,
    ConfirmDeliveryUseCase,
    CreateSalesReturnUseCase,
    ConfirmSalesReturnUseCase,
    // Listeners — تكامل المحاسبة
   
    // Repositories
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: INVOICE_REPOSITORY, useClass: InvoiceRepository },
    { provide: QUOTATION_REPOSITORY, useClass: QuotationRepository },
    { provide: DELIVERY_REPOSITORY, useClass: DeliveryRepository },
    { provide: SALES_RETURN_REPOSITORY, useClass: SalesReturnRepository },
  ],
  exports: [CreateOrderUseCase, CreateInvoiceUseCase],
})
export class SalesModule implements OnModuleInit {
  constructor(private settingsRegistry: SettingsRegistry) {}

  onModuleInit() {
    this.settingsRegistry.register(salesSettingsDefinition);
  }
}