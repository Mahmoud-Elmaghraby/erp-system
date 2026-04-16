import { Controller, Get, Post, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import type { ISalesReturnRepository } from '../../domain/repositories/sales-return.repository.interface';
import { SALES_RETURN_REPOSITORY } from '../../domain/repositories/sales-return.repository.interface';
import { CreateSalesReturnUseCase } from '../../application/use-cases/sales-returns/create-sales-return.use-case';
import { ConfirmSalesReturnUseCase } from '../../application/use-cases/sales-returns/confirm-sales-return.use-case';
import { CreateSalesReturnDto } from '../../application/dtos/sales-return.dto';
import { PrismaService } from '@org/core';

@ApiTags('Sales Returns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('sales-returns')
export class SalesReturnsController {
  constructor(
    @Inject(SALES_RETURN_REPOSITORY)
    private salesReturnRepository: ISalesReturnRepository,
    private createSalesReturnUseCase: CreateSalesReturnUseCase,
    private confirmSalesReturnUseCase: ConfirmSalesReturnUseCase,
    private prisma: PrismaService,
  ) {}

  @Get()
  @RequirePermission('sales.returns.view')
  async findAll(@CurrentUser('companyId') companyId: string) {
    const branches = await this.prisma.branch.findMany({
      where: { companyId },
      select: { id: true },
    });
    const all = await Promise.all(
      branches.map(b => this.salesReturnRepository.findByBranch(b.id))
    );
    return all.flat().sort((a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    );
  }

  @Get(':id')
  @RequirePermission('sales.returns.view')
  findOne(@Param('id') id: string) {
    return this.salesReturnRepository.findById(id);
  }

  @Post()
  @RequirePermission('sales.returns.create')
  create(@Body() dto: CreateSalesReturnDto) {
    return this.createSalesReturnUseCase.execute(dto);
  }

  @Patch(':id/confirm')
  @RequirePermission('sales.returns.confirm')
  confirm(@Param('id') id: string) {
    return this.confirmSalesReturnUseCase.execute(id);
  }

  @Patch(':id/cancel')
  @RequirePermission('sales.returns.edit')
  async cancel(@Param('id') id: string) {
    const ret = await this.salesReturnRepository.findById(id);
    if (!ret) throw new Error('Return not found');
    ret.cancel();
    return this.salesReturnRepository.update(id, { status: 'CANCELLED' });
  }
}