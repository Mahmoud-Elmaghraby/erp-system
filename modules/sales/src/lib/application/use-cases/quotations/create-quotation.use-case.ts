import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DocumentSequenceService, PrismaService, SettingsService } from '@org/core';
import { QuotationEntity } from '../../../domain/entities/quotation.entity';
import { QuotationItemEntity } from '../../../domain/entities/quotation-item.entity';
import { Inject } from '@nestjs/common';
import type { IQuotationRepository } from '../../../domain/repositories/quotation.repository.interface';
import { QUOTATION_REPOSITORY } from '../../../domain/repositories/quotation.repository.interface';
import { CreateQuotationDto } from '../../dtos/quotation.dto';

@Injectable()
export class CreateQuotationUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private quotationRepository: IQuotationRepository,
    private documentSequenceService: DocumentSequenceService,
    private settingsService: SettingsService,
    private prisma: PrismaService,
  ) {}

  async execute(dto: CreateQuotationDto): Promise<QuotationEntity> {
    const branch = await this.prisma.branch.findUnique({ where: { id: dto.branchId } });
    if (!branch) throw new Error('Branch not found');
    const companyId = branch.companyId;

    const taxEnabled = await this.settingsService.getSetting(companyId, 'accounting', 'taxEnabled');
    const taxMethod  = await this.settingsService.getSetting(companyId, 'accounting', 'taxMethod');

    const quotationNumber = await this.documentSequenceService.getNextNumber(
      companyId, 'sales', 'quotation', 'QUO'
    );

    const quotationId = randomUUID();
const quotation = QuotationEntity.create({
  id: randomUUID(),
  quotationNumber,
  branchId: dto.branchId,
  customerId: dto.customerId,
  notes: dto.notes,
  validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
  currency: dto.currency,
  paymentTermId: dto.paymentTermId,
});

    quotation.discountAmount = dto.discountAmount ?? 0;

    // احسب الـ items مع الضريبة
    quotation.items = await Promise.all(dto.items.map(async (item) => {
      let taxAmount = 0;
      if (taxEnabled === 'true' && item.taxId) {
        const tax = await this.prisma.tax.findUnique({ where: { id: item.taxId } });
        if (tax) {
          const subtotal = item.quantity * item.unitPrice - (item.discount ?? 0);
          if (taxMethod === 'INCLUSIVE') {
            taxAmount = subtotal - subtotal / (1 + Number(tax.rate) / 100);
          } else {
            taxAmount = subtotal * (Number(tax.rate) / 100);
          }
        }
      }
      return QuotationItemEntity.create({
        id: randomUUID(),
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        taxAmount,
        taxId: item.taxId,
        quotationId,
      });
    }));

    quotation.calculateTotals();

    return this.quotationRepository.create(quotation);
  }
}