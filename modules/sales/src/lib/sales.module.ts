import { Module } from '@nestjs/common';
import { PrismaService, RbacModule, OutboxModule } from '@org/core';

import { CustomersController } from './presentation/controllers/customers.controller';
import { OrdersController } from './presentation/controllers/orders.controller';
import { InvoicesController } from './presentation/controllers/invoices.controller';

import { CreateCustomerUseCase } from './application/use-cases/customers/create-customer.use-case';
import { CreateOrderUseCase } from './application/use-cases/orders/create-order.use-case';
import { ConfirmOrderUseCase } from './application/use-cases/orders/confirm-order.use-case';

import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { InvoiceRepository } from './infrastructure/repositories/invoice.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository.interface';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository.interface';
import { INVOICE_REPOSITORY } from './domain/repositories/invoice.repository.interface';

@Module({
  imports: [RbacModule, OutboxModule ,EventEmitterModule.forRoot(),],
  controllers: [CustomersController, OrdersController, InvoicesController],
  providers: [
    PrismaService,
    CreateCustomerUseCase,
    CreateOrderUseCase,
    ConfirmOrderUseCase,
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: INVOICE_REPOSITORY, useClass: InvoiceRepository },
  ],
  exports: [CreateOrderUseCase],
})
export class SalesModule {}