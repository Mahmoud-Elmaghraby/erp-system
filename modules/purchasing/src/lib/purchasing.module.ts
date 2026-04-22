import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService, RbacModule, SettingsRegistry, OutboxModule } from '@org/core';
import { purchasingSettingsDefinition } from './purchasing.settings';

import { SuppliersController } from './presentation/controllers/suppliers.controller';
import { PurchaseOrdersController } from './presentation/controllers/purchase-orders.controller';
import { PurchaseReceiptsController } from './presentation/controllers/purchase-receipts.controller';
import { VendorBillsController } from './presentation/controllers/vendor-bills.controller';

import { CreateSupplierUseCase } from './application/use-cases/suppliers/create-supplier.use-case';
import { CreatePurchaseOrderUseCase } from './application/use-cases/orders/create-order.use-case';
import { ConfirmPurchaseOrderUseCase } from './application/use-cases/orders/confirm-order.use-case';
import { CreatePurchaseReceiptUseCase } from './application/use-cases/receipts/create-receipt.use-case';
import { CreateVendorBillUseCase } from './application/use-cases/bills/create-bill.use-case';
import { PayVendorBillUseCase } from './application/use-cases/bills/pay-bill.use-case';

import { SupplierRepository } from './infrastructure/repositories/supplier.repository';
import { PurchaseOrderRepository } from './infrastructure/repositories/purchase-order.repository';
import { PurchaseReceiptRepository } from './infrastructure/repositories/purchase-receipt.repository';
import { VendorBillRepository } from './infrastructure/repositories/vendor-bill.repository';

import { SUPPLIER_REPOSITORY } from './domain/repositories/supplier.repository.interface';
import { PURCHASE_ORDER_REPOSITORY } from './domain/repositories/purchase-order.repository.interface';
import { PURCHASE_RECEIPT_REPOSITORY } from './domain/repositories/purchase-receipt.repository.interface';
import { VENDOR_BILL_REPOSITORY } from './domain/repositories/vendor-bill.repository.interface';

@Module({
  imports: [EventEmitterModule.forRoot(), RbacModule, OutboxModule],
  controllers: [
    SuppliersController,
    PurchaseOrdersController,
    PurchaseReceiptsController,
    VendorBillsController,
  ],
  providers: [
    PrismaService,
    CreateSupplierUseCase,
    CreatePurchaseOrderUseCase,
    ConfirmPurchaseOrderUseCase,
    CreatePurchaseReceiptUseCase,
    CreateVendorBillUseCase,
    PayVendorBillUseCase,
    { provide: SUPPLIER_REPOSITORY, useClass: SupplierRepository },
    { provide: PURCHASE_ORDER_REPOSITORY, useClass: PurchaseOrderRepository },
    { provide: PURCHASE_RECEIPT_REPOSITORY, useClass: PurchaseReceiptRepository },
    { provide: VENDOR_BILL_REPOSITORY, useClass: VendorBillRepository },
  ],
  exports: [CreatePurchaseOrderUseCase],
})
export class PurchasingModule implements OnModuleInit {
  constructor(private settingsRegistry: SettingsRegistry) {}

  onModuleInit() {
    this.settingsRegistry.register(purchasingSettingsDefinition);
  }
}