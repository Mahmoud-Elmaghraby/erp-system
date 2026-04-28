import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OutboxService, PrismaService, SettingsService, DocumentSequenceService } from '@org/core';

import { CreateDirectInvoiceDto } from '../../dtos/invoice.dto';

@Injectable()
export class CreateDirectInvoiceUseCase {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
    private outboxService: OutboxService,
    private documentSequenceService: DocumentSequenceService,
  ) {}

  async execute(dto: CreateDirectInvoiceDto): Promise<Record<string, unknown>> {
    // ── Validate branch + company ──
    const branch = await this.prisma.branch.findUnique({
      where: { id: dto.branchId },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    const companyId = branch.companyId;

    // ── Validate customer ──
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    // ── Validate items ──
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    // ── Tax settings ──
    const taxEnabled = await this.settingsService.getSetting(companyId, 'accounting', 'taxEnabled');
    const taxMethod = await this.settingsService.getSetting(companyId, 'accounting', 'taxMethod');

    // ── Calculate item-level amounts ──
    const itemsData = await Promise.all(dto.items.map(async (item) => {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      const discountPercent = Number(item.discount ?? 0);
      const taxPercent = Number(item.tax ?? 0);

      const subtotal = quantity * unitPrice;
      const itemDiscount = (subtotal * discountPercent) / 100;
      const afterDiscount = subtotal - itemDiscount;

      let taxAmount = 0;
      if (taxEnabled === 'true' && taxPercent > 0) {
        if (taxMethod === 'INCLUSIVE') {
          taxAmount = afterDiscount - afterDiscount / (1 + taxPercent / 100);
        } else {
          taxAmount = (afterDiscount * taxPercent) / 100;
        }
      }

      // If tax is provided by item, also look up by taxId
      if (taxEnabled === 'true' && item.taxId) {
        const tax = await this.prisma.tax.findUnique({ where: { id: item.taxId } });
        if (tax) {
          const rate = Number(tax.rate);
          if (taxMethod === 'INCLUSIVE') {
            taxAmount = afterDiscount - afterDiscount / (1 + rate / 100);
          } else {
            taxAmount = (afterDiscount * rate) / 100;
          }
        }
      }

      const total = afterDiscount + (taxMethod === 'INCLUSIVE' ? 0 : taxAmount);

      return {
        id: randomUUID(),
        productId: item.productId,
        quantity,
        unitPrice,
        discount: itemDiscount,
        subtotal: afterDiscount,
        taxAmount,
        total,
        taxId: item.taxId ?? null,
        // E-Invoice fields from product
        itemCode: product.itemCode ?? null,
        itemType: product.itemType ?? null,
        unitType: product.unitType ?? null,
      };
    }));

    // ── Calculate totals ──
    let untaxedAmount = itemsData.reduce((sum, i) => sum + i.subtotal, 0);
    const itemTaxTotal = itemsData.reduce((sum, i) => sum + i.taxAmount, 0);
    const itemDiscountTotal = itemsData.reduce((sum, i) => sum + i.discount, 0);

    // ── Overall discount ──
    let overallDiscount = 0;
    const overallDiscountVal = Number(dto.overallDiscount ?? 0);
    if (overallDiscountVal > 0) {
      if (dto.overallDiscountType === 'percentage') {
        overallDiscount = (untaxedAmount * overallDiscountVal) / 100;
      } else {
        overallDiscount = overallDiscountVal;
      }
      untaxedAmount -= overallDiscount;
    }

    const totalDiscount = itemDiscountTotal + overallDiscount;
    const taxAmount = itemTaxTotal;
    const totalAmount = untaxedAmount + taxAmount;

    // ── Advance payment ──
    let paidAmount = 0;
    if (dto.advancePayment && dto.advancePayment > 0) {
      if (dto.advancePaymentType === 'percentage') {
        paidAmount = (totalAmount * dto.advancePayment) / 100;
      } else {
        paidAmount = dto.advancePayment;
      }
    }

    // ── Generate document numbers ──
    const orderNumber = await this.documentSequenceService.getNextNumber(
      companyId, 'sales', 'order', 'SO'
    );
    const invoiceNumber = await this.documentSequenceService.getNextNumber(
      companyId, 'sales', 'invoice', 'INV'
    );

    // ── Determine status ──
    const isDraft = dto.saveMode === 'draft';
    let invoiceStatus = isDraft ? 'DRAFT' : (paidAmount >= totalAmount ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'UNPAID'));

    // If caller provided a paymentStatus from frontend, respect it (map to internal enum)
    if (dto.paymentStatus) {
      const raw = String(dto.paymentStatus);
      // Normalize common variants to the lowercase keys we map
      let normalized = raw;
      if (raw === 'PARTIAL') normalized = 'partially_paid';
      if (raw === 'PARTIALLY_PAID') normalized = 'partially_paid';
      if (raw === 'UNPAID') normalized = 'unpaid';
      if (raw === 'PAID') normalized = 'paid';
      if (raw === 'DRAFT') normalized = 'draft';
      if (raw === 'draft') normalized = 'draft';

      const map: Record<string, string> = {
        unpaid: 'UNPAID',
        paid: 'PAID',
        partially_paid: 'PARTIAL',
        draft: 'DRAFT',
      };
      const provided = map[normalized];
      if (provided) {
        invoiceStatus = provided;
        // If frontend indicates fully paid, set paidAmount to totalAmount
        if (normalized === 'paid') {
          paidAmount = totalAmount;
        }
        // If partially paid and no advance provided, use advancePayment if available
        if (normalized === 'partially_paid' && paidAmount === 0 && dto.advancePayment) {
          if (dto.advancePaymentType === 'percentage') {
            paidAmount = (totalAmount * dto.advancePayment) / 100;
          } else {
            paidAmount = dto.advancePayment as number;
          }
        }
        // If draft, ensure paidAmount is zero
        if (normalized === 'draft') {
          paidAmount = 0;
        }
      }
    }

    const orderId = randomUUID();
    const invoiceId = randomUUID();

    const dateTimeIssued = dto.date ? new Date(dto.date) : new Date();
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;

    // ── Create everything in a transaction ──
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create the backing SalesOrder
      await tx.salesOrder.create({
        data: {
          id: orderId,
          orderNumber,
          status: 'CONFIRMED',
          branchId: dto.branchId,
          customerId: dto.customerId,
          notes: dto.notes ?? null,
          untaxedAmount,
          taxAmount,
          totalAmount,
          discountAmount: totalDiscount,
          currency: dto.currency ?? 'EGP',
          items: {
            create: itemsData.map((item) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              subtotal: item.subtotal,
              taxAmount: item.taxAmount,
              total: item.total,
              taxId: item.taxId,
            })),
          },
        },
      });

      // 2. Create the Invoice
      const invoice = await tx.invoice.create({
        data: {
          id: invoiceId,
          invoiceNumber,
          status: invoiceStatus as any,
          untaxedAmount,
          taxAmount,
          totalAmount,
          paidAmount,
          discountAmount: totalDiscount,
          currency: dto.currency ?? 'EGP',
          exchangeRate: 1,
          dueDate,
          dateTimeIssued,
          orderId,
          paymentTermId: dto.paymentTermId ?? null,
          items: {
            create: itemsData.map((item) => ({
              id: randomUUID(),
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              subtotal: item.subtotal,
              taxAmount: item.taxAmount,
              total: item.total,
              taxId: item.taxId,
              itemCode: item.itemCode,
              itemType: item.itemType,
              unitType: item.unitType,
            })),
          },
        } as any,
        include: {
          items: { include: { product: true } },
          order: { include: { customer: true } },
          paymentTerm: true,
        },
      });

      // 3. Create advance payment record if applicable
      if (paidAmount > 0) {
        await tx.payment.create({
          data: {
            id: randomUUID(),
            amount: paidAmount,
            paymentMethod: 'CASH',
            reference: 'دفعة مقدمة',
            notes: 'دفعة مقدمة عند إنشاء الفاتورة',
            invoiceId,
          },
        });
      }

      // 4. Publish outbox event
      await this.outboxService.publish(
        'invoice.created',
        {
          invoiceId,
          invoiceNumber,
          orderId,
          companyId,
          customerId: dto.customerId,
          untaxedAmount,
          taxAmount,
          totalAmount,
          currency: dto.currency ?? 'EGP',
          date: dateTimeIssued,
        },
        tx,
      );

      return invoice;
    });

    return result as unknown as Record<string, unknown>;
  }
}
