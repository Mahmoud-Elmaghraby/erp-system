import { CustomerEntity } from '../entities/customer.entity';

export interface ICustomerRepository {
  findAll(): Promise<CustomerEntity[]>;
  findById(id: string): Promise<CustomerEntity | null>;
  create(customer: CustomerEntity): Promise<CustomerEntity>;
  update(id: string, data: Partial<CustomerEntity>): Promise<CustomerEntity>;
  delete(id: string): Promise<void>;
}

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';