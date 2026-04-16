import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../../domain/repositories/stock.repository.interface';
import type { IStockMovementRepository } from '../../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../../domain/repositories/stock-movement.repository.interface';
import type { IInventorySettingsRepository } from '../../../domain/repositories/inventory-settings.repository.interface';
import { INVENTORY_SETTINGS_REPOSITORY } from '../../../domain/repositories/inventory-settings.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockUpdatedEvent } from '../../../domain/events/stock-updated.event';
import { StockLowEvent } from '../../../domain/events/stock-low.event';
import { StockMovementEntity } from '../../../domain/entities/stock-movement.entity';
import { Quantity } from '../../../domain/value-objects/quantity.vo';
import { RemoveStockDto } from '../../dtos/stock.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class RemoveStockUseCase {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
    @Inject(INVENTORY_SETTINGS_REPOSITORY)
    private inventorySettingsRepository: IInventorySettingsRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: RemoveStockDto, companyId: string) {
    const stock = await this.stockRepository.findByWarehouseAndProduct(
      dto.warehouseId, dto.productId
    );

    const settings = await this.inventorySettingsRepository.findByCompany(companyId);
    const allowNegative = settings?.allowNegativeStock ?? false;

    if (!stock) {
      if (!allowNegative) throw new NotFoundException('Stock not found');
      // لو السماح بالسالب — اعمل stock بقيمة سالبة
      await this.stockRepository.upsert(dto.warehouseId, dto.productId, -dto.quantity);
    } else {
      const currentQty = stock.quantity.getValue();
      if (!allowNegative && currentQty < dto.quantity) {
        throw new BadRequestException(
          `الكمية غير كافية. المتاح: ${currentQty}, المطلوب: ${dto.quantity}`
        );
      }
      stock.removeQuantity(Quantity.create(dto.quantity));
      await this.stockRepository.update(stock.id, stock.quantity.getValue());
    }

    await this.stockMovementRepository.create(
      StockMovementEntity.create({
        id: randomUUID(),
        type: 'OUT',
        quantity: dto.quantity,
        warehouseId: dto.warehouseId,
        productId: dto.productId,
        companyId,
        reason: dto.reason,
      }),
    );

    this.eventEmitter.emit('stock.updated', new StockUpdatedEvent(
      dto.warehouseId, dto.productId, dto.quantity, 'OUT'
    ));

    const updated = await this.stockRepository.findByWarehouseAndProduct(
      dto.warehouseId, dto.productId
    );

    if (updated?.isBelowMinStock()) {
      this.eventEmitter.emit('stock.low', new StockLowEvent(
        dto.warehouseId, dto.productId,
        updated.quantity.getValue(), updated.minStock.getValue(),
      ));
    }

    return updated;
  }
}