import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService, RbacModule, SettingsRegistry } from '@org/core';
import { inventorySettingsDefinition } from './inventory.settings';
import { DeliveryConfirmedListener } from './application/listeners/delivery-confirmed.listener';
import { SalesReturnConfirmedListener } from './application/listeners/sales-return-confirmed.listener';
import { ProductsController } from './presentation/controllers/products.controller';
import { WarehousesController } from './presentation/controllers/warehouses.controller';
import { StockController } from './presentation/controllers/stock.controller';
import { CategoriesController } from './presentation/controllers/categories.controller';
import { UnitsController } from './presentation/controllers/units.controller';
import { StockMovementsController } from './presentation/controllers/stock-movements.controller';
import { StockAdjustmentsController } from './presentation/controllers/stock-adjustments.controller';
import { ReorderingRulesController } from './presentation/controllers/reordering-rules.controller';
import { InventorySettingsController } from './presentation/controllers/inventory-settings.controller';
import { ProductVariantsController } from './presentation/controllers/product-variants.controller';
import { ProductPriceHistoryController } from './presentation/controllers/product-price-history.controller';
import { LotNumbersController } from './presentation/controllers/lot-numbers.controller';
import { SerialNumbersController } from './presentation/controllers/serial-numbers.controller';
import { StockValuationController } from './presentation/controllers/stock-valuation.controller';

import { CreateProductUseCase } from './application/use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/products/update-product.use-case';
import { CreateWarehouseUseCase } from './application/use-cases/warehouses/create-warehouse.use-case';
import { AddStockUseCase } from './application/use-cases/stock/add-stock.use-case';
import { RemoveStockUseCase } from './application/use-cases/stock/remove-stock.use-case';
import { TransferStockUseCase } from './application/use-cases/stock/transfer-stock.use-case';
import { CreateCategoryUseCase } from './application/use-cases/categories/create-category.use-case';
import { CreateUnitUseCase } from './application/use-cases/units/create-unit.use-case';
import { CreateStockAdjustmentUseCase } from './application/use-cases/stock/create-adjustment.use-case';
import { ConfirmStockAdjustmentUseCase } from './application/use-cases/stock/confirm-adjustment.use-case';

import { ProductRepository } from './infrastructure/repositories/product.repository';
import { WarehouseRepository } from './infrastructure/repositories/warehouse.repository';
import { StockRepository } from './infrastructure/repositories/stock.repository';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { UnitRepository } from './infrastructure/repositories/unit.repository';
import { StockMovementRepository } from './infrastructure/repositories/stock-movement.repository';
import { StockAdjustmentRepository } from './infrastructure/repositories/stock-adjustment.repository';
import { ReorderingRuleRepository } from './infrastructure/repositories/reordering-rule.repository';
import { InventorySettingsRepository } from './infrastructure/repositories/inventory-settings.repository';
import { ProductVariantRepository } from './infrastructure/repositories/product-variant.repository';
import { LotNumberRepository } from './infrastructure/repositories/lot-number.repository';
import { SerialNumberRepository } from './infrastructure/repositories/serial-number.repository';

import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface';
import { WAREHOUSE_REPOSITORY } from './domain/repositories/warehouse.repository.interface';
import { STOCK_REPOSITORY } from './domain/repositories/stock.repository.interface';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.interface';
import { UNIT_REPOSITORY } from './domain/repositories/unit.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from './domain/repositories/stock-movement.repository.interface';
import { STOCK_ADJUSTMENT_REPOSITORY } from './domain/repositories/stock-adjustment.repository.interface';
import { REORDERING_RULE_REPOSITORY } from './domain/repositories/reordering-rule.repository.interface';
import { INVENTORY_SETTINGS_REPOSITORY } from './domain/repositories/inventory-settings.repository.interface';
import { PRODUCT_VARIANT_REPOSITORY } from './domain/repositories/product-variant.repository.interface';
import { LOT_NUMBER_REPOSITORY } from './domain/repositories/lot-number.repository.interface';
import { SERIAL_NUMBER_REPOSITORY } from './domain/repositories/serial-number.repository.interface';

import { OrderConfirmedListener } from './application/listeners/order-confirmed.listener';
import { PurchaseReceivedListener } from './application/listeners/purchase-received.listener';
import { StockLowListener } from './application/listeners/stock-low.listener';
import { StockValuationService } from './application/services/stock-valuation.service';

@Module({
  imports: [EventEmitterModule.forRoot(), RbacModule],
  controllers: [
    ProductsController,
    WarehousesController,
    StockController,
    CategoriesController,
    UnitsController,
    StockMovementsController,
    StockAdjustmentsController,
    ReorderingRulesController,
    InventorySettingsController,
    ProductVariantsController,
    ProductPriceHistoryController,
    LotNumbersController,
    SerialNumbersController,
    StockValuationController,
  ],
  providers: [
    PrismaService,
    CreateProductUseCase,
    UpdateProductUseCase,
    CreateWarehouseUseCase,
    AddStockUseCase,
    RemoveStockUseCase,
    TransferStockUseCase,
    CreateCategoryUseCase,
    CreateUnitUseCase,
    CreateStockAdjustmentUseCase,
    ConfirmStockAdjustmentUseCase,
    OrderConfirmedListener,
    PurchaseReceivedListener,
    StockLowListener,
    StockValuationService,
    DeliveryConfirmedListener,
SalesReturnConfirmedListener,
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: WAREHOUSE_REPOSITORY, useClass: WarehouseRepository },
    { provide: STOCK_REPOSITORY, useClass: StockRepository },
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
    { provide: UNIT_REPOSITORY, useClass: UnitRepository },
    { provide: STOCK_MOVEMENT_REPOSITORY, useClass: StockMovementRepository },
    { provide: STOCK_ADJUSTMENT_REPOSITORY, useClass: StockAdjustmentRepository },
    { provide: REORDERING_RULE_REPOSITORY, useClass: ReorderingRuleRepository },
    { provide: INVENTORY_SETTINGS_REPOSITORY, useClass: InventorySettingsRepository },
    { provide: PRODUCT_VARIANT_REPOSITORY, useClass: ProductVariantRepository },
    { provide: LOT_NUMBER_REPOSITORY, useClass: LotNumberRepository },
    { provide: SERIAL_NUMBER_REPOSITORY, useClass: SerialNumberRepository },
  ],
  exports: [CreateProductUseCase, AddStockUseCase, RemoveStockUseCase],
})
export class InventoryModule implements OnModuleInit {
  constructor(private settingsRegistry: SettingsRegistry) {}

  onModuleInit() {
    this.settingsRegistry.register(inventorySettingsDefinition);
  }
}