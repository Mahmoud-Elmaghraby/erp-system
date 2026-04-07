import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrgCoreModule } from '@org/core';
import { InventoryModule } from '@org/inventory';
import { SalesModule } from '@org/sales';
import { PurchasingModule } from '@org/purchasing';

const enabledModules = process.env.ENABLED_MODULES?.split(',') || ['inventory', 'sales', 'purchasing'];

@Module({
  imports: [
    OrgCoreModule,
    ...enabledModules.includes('inventory') ? [InventoryModule] : [],
    ...enabledModules.includes('sales') ? [SalesModule] : [],
    ...enabledModules.includes('purchasing') ? [PurchasingModule] : [],
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}