import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService, RbacModule } from '@org/core';

import { ProductsController } from './presentation/controllers/products.controller';
import { WarehousesController } from './presentation/controllers/warehouses.controller';
import { StockController } from './presentation/controllers/stock.controller';
import { CategoriesController } from './presentation/controllers/categories.controller';
import { UnitsController } from './presentation/controllers/units.controller';

import { CreateProductUseCase } from './application/use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/products/update-product.use-case';
import { CreateWarehouseUseCase } from './application/use-cases/warehouses/create-warehouse.use-case';
import { AddStockUseCase } from './application/use-cases/stock/add-stock.use-case';
import { RemoveStockUseCase } from './application/use-cases/stock/remove-stock.use-case';
import { TransferStockUseCase } from './application/use-cases/stock/transfer-stock.use-case';
import { CreateCategoryUseCase } from './application/use-cases/categories/create-category.use-case';
import { CreateUnitUseCase } from './application/use-cases/units/create-unit.use-case';

import { ProductRepository } from './infrastructure/repositories/product.repository';
import { WarehouseRepository } from './infrastructure/repositories/warehouse.repository';
import { StockRepository } from './infrastructure/repositories/stock.repository';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { UnitRepository } from './infrastructure/repositories/unit.repository';

import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface';
import { WAREHOUSE_REPOSITORY } from './domain/repositories/warehouse.repository.interface';
import { STOCK_REPOSITORY } from './domain/repositories/stock.repository.interface';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.interface';
import { UNIT_REPOSITORY } from './domain/repositories/unit.repository.interface';

@Module({
  imports: [EventEmitterModule.forRoot(), RbacModule],
  controllers: [
    ProductsController,
    WarehousesController,
    StockController,
    CategoriesController,
    UnitsController,
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
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: WAREHOUSE_REPOSITORY, useClass: WarehouseRepository },
    { provide: STOCK_REPOSITORY, useClass: StockRepository },
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
    { provide: UNIT_REPOSITORY, useClass: UnitRepository },
  ],
  exports: [CreateProductUseCase, AddStockUseCase, RemoveStockUseCase],
})
export class InventoryModule {}