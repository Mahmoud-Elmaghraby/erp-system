import { Inject, Injectable } from '@nestjs/common';
import type { ISupplierRepository } from '../../../domain/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../../domain/repositories/supplier.repository.interface';
import { SupplierEntity } from '../../../domain/entities/supplier.entity';
import { CreateSupplierDto } from '../../dtos/supplier.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(dto: CreateSupplierDto): Promise<SupplierEntity> {
    const supplier = SupplierEntity.create({ id: randomUUID(), ...dto });
    return this.supplierRepository.create(supplier);
  }
}