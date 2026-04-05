import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrgCoreModule } from '@org/core';
import { InventoryModule } from '@org/inventory';

@Module({
  imports: [OrgCoreModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}