// backend/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@org/core';
import { InventoryModule } from '@org/inventory';
import { SalesModule } from '@org/sales';
import { PurchasingModule } from '@org/purchasing';
import { AccountingModule } from '@org/accounting';
import { HealthController } from './health.controller';

const enabledModules = process.env['ENABLED_MODULES']?.split(',') || [
  'inventory', 'sales', 'purchasing', 'accounting',
];

const dynamicModules = [
  ...enabledModules.includes('inventory')  ? [InventoryModule]  : [],
  ...enabledModules.includes('sales')      ? [SalesModule]      : [],
  ...enabledModules.includes('purchasing') ? [PurchasingModule] : [],
  ...enabledModules.includes('accounting') ? [AccountingModule] : [],
];

@Module({
  imports: [
    CoreModule,
    ...dynamicModules,
    RouterModule.register([
      { path: 'inventory',  module: InventoryModule  },
      { path: 'sales',      module: SalesModule      },
      { path: 'purchasing', module: PurchasingModule },
      { path: 'accounting', module: AccountingModule },
    ]),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}