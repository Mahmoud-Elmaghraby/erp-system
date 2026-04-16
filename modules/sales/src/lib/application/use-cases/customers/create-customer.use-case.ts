import { Inject, Injectable } from '@nestjs/common';
import type { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { CreateCustomerDto } from '../../dtos/customer.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(dto: CreateCustomerDto, companyId: string): Promise<CustomerEntity> {
    const customer = CustomerEntity.create({ id: randomUUID(), ...dto, companyId });
    return this.customerRepository.create(customer);
  }
}