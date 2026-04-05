import { Inject, Injectable } from '@nestjs/common';
import type { IWarehouseRepository } from '../../../domain/repositories/warehouse.repository.interface';
import { WAREHOUSE_REPOSITORY } from '../../../domain/repositories/warehouse.repository.interface';import { WarehouseEntity } from '../../../domain/entities/warehouse.entity';
import { CreateWarehouseDto } from '../../dtos/warehouse.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(dto: CreateWarehouseDto): Promise<WarehouseEntity> {
    const warehouse = WarehouseEntity.create({ id: randomUUID(), ...dto });
    return this.warehouseRepository.create(warehouse);
  }
}