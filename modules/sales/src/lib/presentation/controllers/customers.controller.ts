import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateCustomerUseCase } from '../../application/use-cases/customers/create-customer.use-case';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../../domain/repositories/customer.repository.interface';
import { CreateCustomerDto, UpdateCustomerDto } from '../../application/dtos/customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private createCustomerUseCase: CreateCustomerUseCase,
    @Inject(CUSTOMER_REPOSITORY)
    private customerRepository: ICustomerRepository,
  ) {}

  @Get()
  @RequirePermission('sales.customers.view')
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.customerRepository.findAll(companyId);
  }

  @Get(':id')
  @RequirePermission('sales.customers.view')
  findOne(@Param('id') id: string) {
    return this.customerRepository.findById(id);
  }

  @Post()
  @RequirePermission('sales.customers.create')
  create(@Body() dto: CreateCustomerDto, @CurrentUser('companyId') companyId: string) {
    return this.createCustomerUseCase.execute(dto, companyId);
  }

  @Patch(':id')
  @RequirePermission('sales.customers.edit')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerRepository.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('sales.customers.delete')
  remove(@Param('id') id: string) {
    return this.customerRepository.delete(id);
  }
}