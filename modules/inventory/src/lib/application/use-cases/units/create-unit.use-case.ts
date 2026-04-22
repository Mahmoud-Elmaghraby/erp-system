import { Inject, Injectable } from '@nestjs/common';
import type { IUnitRepository } from '../../../domain/repositories/unit.repository.interface';
import { UNIT_REPOSITORY } from '../../../domain/repositories/unit.repository.interface';
import { UnitEntity } from '../../../domain/entities/unit.entity';
import { CreateUnitDto } from '../../dtos/unit.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateUnitUseCase {
  constructor(
    @Inject(UNIT_REPOSITORY)
    private unitRepository: IUnitRepository,
  ) {}

  async execute(dto: CreateUnitDto, companyId: string): Promise<UnitEntity> {
    const unit = UnitEntity.create({ id: randomUUID(), ...dto, companyId });
    return this.unitRepository.create(unit);
  }
}