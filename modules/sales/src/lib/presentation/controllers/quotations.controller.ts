import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import type { IQuotationRepository } from '../../domain/repositories/quotation.repository.interface';
import { QUOTATION_REPOSITORY } from '../../domain/repositories/quotation.repository.interface';
import { CreateQuotationUseCase } from '../../application/use-cases/quotations/create-quotation.use-case';
import { ConfirmQuotationUseCase } from '../../application/use-cases/quotations/confirm-quotation.use-case';
import { CreateQuotationDto, UpdateQuotationDto } from '../../application/dtos/quotation.dto';
import { PrismaService } from '@org/core';

@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private quotationRepository: IQuotationRepository,
    private createQuotationUseCase: CreateQuotationUseCase,
    private confirmQuotationUseCase: ConfirmQuotationUseCase,
    private prisma: PrismaService,
  ) {}

  @Get()
  @RequirePermission('sales.quotations.view')
  async findAll(@CurrentUser('companyId') companyId: string) {
    const branches = await this.prisma.branch.findMany({
      where: { companyId },
      select: { id: true },
    });
    const all = await Promise.all(
      branches.map(b => this.quotationRepository.findAll(b.id))
    );
    return all.flat().sort((a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    );
  }

  @Get(':id')
  @RequirePermission('sales.quotations.view')
  findOne(@Param('id') id: string) {
    return this.quotationRepository.findDetails(id);
  }

  @Post()
  @RequirePermission('sales.quotations.create')
  create(@Body() dto: CreateQuotationDto) {
    return this.createQuotationUseCase.execute(dto);
  }

  @Patch(':id')
  @RequirePermission('sales.quotations.edit')
  update(@Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.quotationRepository.update(id, dto);
  }

  @Patch(':id/confirm')
  @RequirePermission('sales.quotations.confirm')
  confirm(@Param('id') id: string) {
    return this.confirmQuotationUseCase.execute(id);
  }

  @Patch(':id/send')
  @RequirePermission('sales.quotations.edit')
  async send(@Param('id') id: string) {
    const quotation = await this.quotationRepository.findById(id);
    if (!quotation) throw new Error('Quotation not found');
    quotation.send();
    return this.quotationRepository.update(id, { status: 'SENT' });
  }

  @Patch(':id/cancel')
  @RequirePermission('sales.quotations.edit')
  async cancel(@Param('id') id: string) {
    const quotation = await this.quotationRepository.findById(id);
    if (!quotation) throw new Error('Quotation not found');
    quotation.cancel();
    return this.quotationRepository.update(id, { status: 'CANCELLED' });
  }

  @Delete(':id')
  @RequirePermission('sales.quotations.delete')
  delete(@Param('id') id: string) {
    return this.quotationRepository.delete(id);
  }
}