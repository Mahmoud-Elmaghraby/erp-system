import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@org/core';
import { randomUUID } from 'crypto';
import {
  BulkUpdatePriceListsDto,
  CreatePriceListDto,
  CreatePriceOfferDto,
  CreateShippingOptionDto,
  SaveOrderSourcesDto,
  UpdatePriceListDto,
  UpdatePriceOfferDto,
  UpdateShippingConfigDto,
  UpdateShippingOptionDto,
} from '../dtos/sales-settings.dto';

type DbStatus = 'ACTIVE' | 'INACTIVE';
type UiStatus = 'active' | 'inactive';

type PriceListView = {
  id: string;
  name: string;
  status: UiStatus;
  createdAt: Date;
  updatedAt: Date;
};

type OrderSourceView = {
  id: string;
  name: string;
  status: UiStatus;
  createdAt: Date;
  updatedAt: Date;
};

type ShippingOptionView = {
  id: string;
  name: string;
  status: UiStatus;
  createdAt: Date;
  updatedAt: Date;
};

type PriceOfferView = {
  id: string;
  name: string;
  validFrom: string | null;
  validTo: string | null;
  requiredQty: number;
  type: string;
  discountValue: number;
  discountType: string;
  customerScope: string;
  unitType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class SalesModuleSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private toDbStatus(status?: string): DbStatus {
    return status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
  }

  private toUiStatus(status: DbStatus): UiStatus {
    return status === 'INACTIVE' ? 'inactive' : 'active';
  }

  private normalizeNullableString(value?: string | null): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private mapPriceList(list: {
    id: string;
    name: string;
    status: DbStatus;
    createdAt: Date;
    updatedAt: Date;
  }): PriceListView {
    return {
      ...list,
      status: this.toUiStatus(list.status),
    };
  }

  private mapOrderSource(source: {
    id: string;
    name: string;
    status: DbStatus;
    createdAt: Date;
    updatedAt: Date;
  }): OrderSourceView {
    return {
      ...source,
      status: this.toUiStatus(source.status),
    };
  }

  private mapShippingOption(option: {
    id: string;
    name: string;
    status: DbStatus;
    createdAt: Date;
    updatedAt: Date;
  }): ShippingOptionView {
    return {
      ...option,
      status: this.toUiStatus(option.status),
    };
  }

  private mapPriceOffer(offer: {
    id: string;
    name: string;
    validFrom: Date | null;
    validTo: Date | null;
    requiredQty: number;
    type: string;
    discountValue: { toString(): string };
    discountType: string;
    customerScope: string;
    unitType: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): PriceOfferView {
    return {
      id: offer.id,
      name: offer.name,
      validFrom: offer.validFrom ? offer.validFrom.toISOString().slice(0, 10) : null,
      validTo: offer.validTo ? offer.validTo.toISOString().slice(0, 10) : null,
      requiredQty: offer.requiredQty,
      type: offer.type,
      discountValue: Number(offer.discountValue.toString()),
      discountType: offer.discountType,
      customerScope: offer.customerScope,
      unitType: offer.unitType,
      isActive: offer.isActive,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };
  }

  private async assertPriceListOwnership(companyId: string, id: string): Promise<void> {
    const exists = await this.prisma.salesPriceList.findFirst({
      where: { id, companyId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Price list not found');
    }
  }

  private async assertShippingOptionOwnership(companyId: string, id: string): Promise<void> {
    const exists = await this.prisma.salesShippingOption.findFirst({
      where: { id, companyId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Shipping option not found');
    }
  }

  private async assertOfferOwnership(companyId: string, id: string): Promise<void> {
    const exists = await this.prisma.salesPriceOffer.findFirst({
      where: { id, companyId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Offer not found');
    }
  }

  async listPriceLists(companyId: string): Promise<PriceListView[]> {
    const lists = await this.prisma.salesPriceList.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return lists.map((list) => this.mapPriceList(list));
  }

  async createPriceList(companyId: string, dto: CreatePriceListDto): Promise<PriceListView> {
    const created = await this.prisma.salesPriceList.create({
      data: {
        companyId,
        name: dto.name.trim(),
        status: this.toDbStatus(dto.status),
      },
    });

    return this.mapPriceList(created);
  }

  async updatePriceList(
    companyId: string,
    id: string,
    dto: UpdatePriceListDto,
  ): Promise<PriceListView> {
    await this.assertPriceListOwnership(companyId, id);

    const data: { name?: string; status?: DbStatus } = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.status !== undefined) {
      data.status = this.toDbStatus(dto.status);
    }

    if (Object.keys(data).length === 0) {
      const current = await this.prisma.salesPriceList.findUnique({ where: { id } });
      if (!current) {
        throw new NotFoundException('Price list not found');
      }
      return this.mapPriceList(current);
    }

    const updated = await this.prisma.salesPriceList.update({
      where: { id },
      data,
    });

    return this.mapPriceList(updated);
  }

  async deletePriceList(companyId: string, id: string): Promise<{ success: true }> {
    const result = await this.prisma.salesPriceList.deleteMany({
      where: { companyId, id },
    });

    if (result.count === 0) {
      throw new NotFoundException('Price list not found');
    }

    return { success: true };
  }

  async applyPriceListBulkUpdate(
    companyId: string,
    dto: BulkUpdatePriceListsDto,
  ): Promise<{ success: true; appliedToCompany: string; sourceType: string; adjustmentType: string; adjustmentValue: number }> {
    if (dto.sourceType === 'OTHER_LIST') {
      if (!dto.sourceListId) {
        throw new NotFoundException('sourceListId is required when sourceType is OTHER_LIST');
      }

      await this.assertPriceListOwnership(companyId, dto.sourceListId);
    }

    return {
      success: true,
      appliedToCompany: companyId,
      sourceType: dto.sourceType,
      adjustmentType: dto.adjustmentType,
      adjustmentValue: dto.adjustmentValue,
    };
  }

  async getOrderSources(companyId: string): Promise<{
    sources: OrderSourceView[];
    defaultSourceId: string | null;
    isMandatory: boolean;
  }> {
    const [sources, settings] = await Promise.all([
      this.prisma.salesOrderSource.findMany({
        where: { companyId },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.salesSettings.findUnique({
        where: { companyId },
        select: {
          defaultOrderSourceId: true,
          orderSourceMandatory: true,
        },
      }),
    ]);

    return {
      sources: sources.map((source) => this.mapOrderSource(source)),
      defaultSourceId: settings?.defaultOrderSourceId ?? null,
      isMandatory: settings?.orderSourceMandatory ?? false,
    };
  }

  async saveOrderSources(
    companyId: string,
    dto: SaveOrderSourcesDto,
  ): Promise<{
    sources: OrderSourceView[];
    defaultSourceId: string | null;
    isMandatory: boolean;
  }> {
    const seenNames = new Set<string>();
    const normalizedSources = dto.sources
      .map((source) => ({
        id: source.id ?? randomUUID(),
        companyId,
        name: source.name.trim(),
        status: this.toDbStatus(source.status),
      }))
      .filter((source) => {
        if (source.name.length === 0) {
          return false;
        }

        const key = source.name.toLowerCase();
        if (seenNames.has(key)) {
          return false;
        }

        seenNames.add(key);
        return true;
      });

    const requestedDefaultId = this.normalizeNullableString(dto.defaultSourceId);
    const validatedDefaultId = requestedDefaultId && normalizedSources.some((source) => source.id === requestedDefaultId)
      ? requestedDefaultId
      : null;

    await this.prisma.$transaction(async (tx) => {
      await tx.salesOrderSource.deleteMany({ where: { companyId } });

      if (normalizedSources.length > 0) {
        await tx.salesOrderSource.createMany({ data: normalizedSources });
      }

      await tx.salesSettings.upsert({
        where: { companyId },
        update: {
          orderSourceMandatory: dto.isMandatory ?? false,
          defaultOrderSourceId: validatedDefaultId,
        },
        create: {
          id: randomUUID(),
          companyId,
          orderSourceMandatory: dto.isMandatory ?? false,
          defaultOrderSourceId: validatedDefaultId,
        },
      });
    });

    return this.getOrderSources(companyId);
  }

  async getShippingConfig(companyId: string): Promise<{ isEnabled: boolean; codFeeItemId: string | null }> {
    const settings = await this.prisma.salesSettings.findUnique({
      where: { companyId },
      select: {
        shippingOptionsEnabled: true,
        codFeeItemId: true,
      },
    });

    return {
      isEnabled: settings?.shippingOptionsEnabled ?? true,
      codFeeItemId: settings?.codFeeItemId ?? null,
    };
  }

  async updateShippingConfig(
    companyId: string,
    dto: UpdateShippingConfigDto,
  ): Promise<{ isEnabled: boolean; codFeeItemId: string | null }> {
    const updateData: {
      shippingOptionsEnabled?: boolean;
      codFeeItemId?: string | null;
    } = {};

    if (dto.isEnabled !== undefined) {
      updateData.shippingOptionsEnabled = dto.isEnabled;
    }

    if (dto.codFeeItemId !== undefined) {
      updateData.codFeeItemId = this.normalizeNullableString(dto.codFeeItemId);
    }

    if (Object.keys(updateData).length === 0) {
      return this.getShippingConfig(companyId);
    }

    const settings = await this.prisma.salesSettings.upsert({
      where: { companyId },
      update: updateData,
      create: {
        id: randomUUID(),
        companyId,
        ...updateData,
      },
    });

    return {
      isEnabled: settings.shippingOptionsEnabled,
      codFeeItemId: settings.codFeeItemId ?? null,
    };
  }

  async listShippingOptions(companyId: string): Promise<ShippingOptionView[]> {
    const options = await this.prisma.salesShippingOption.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });

    return options.map((option) => this.mapShippingOption(option));
  }

  async createShippingOption(
    companyId: string,
    dto: CreateShippingOptionDto,
  ): Promise<ShippingOptionView> {
    const created = await this.prisma.salesShippingOption.create({
      data: {
        companyId,
        name: dto.name.trim(),
        status: this.toDbStatus(dto.status),
      },
    });

    return this.mapShippingOption(created);
  }

  async updateShippingOption(
    companyId: string,
    id: string,
    dto: UpdateShippingOptionDto,
  ): Promise<ShippingOptionView> {
    await this.assertShippingOptionOwnership(companyId, id);

    const data: { name?: string; status?: DbStatus } = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.status !== undefined) {
      data.status = this.toDbStatus(dto.status);
    }

    if (Object.keys(data).length === 0) {
      const current = await this.prisma.salesShippingOption.findUnique({ where: { id } });
      if (!current) {
        throw new NotFoundException('Shipping option not found');
      }
      return this.mapShippingOption(current);
    }

    const updated = await this.prisma.salesShippingOption.update({
      where: { id },
      data,
    });

    return this.mapShippingOption(updated);
  }

  async deleteShippingOption(companyId: string, id: string): Promise<{ success: true }> {
    const result = await this.prisma.salesShippingOption.deleteMany({
      where: { companyId, id },
    });

    if (result.count === 0) {
      throw new NotFoundException('Shipping option not found');
    }

    return { success: true };
  }

  async listPriceOffers(companyId: string): Promise<PriceOfferView[]> {
    const offers = await this.prisma.salesPriceOffer.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return offers.map((offer) => this.mapPriceOffer(offer));
  }

  async createPriceOffer(companyId: string, dto: CreatePriceOfferDto): Promise<PriceOfferView> {
    const created = await this.prisma.salesPriceOffer.create({
      data: {
        companyId,
        name: dto.name.trim(),
        validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
        validTo: dto.validTo ? new Date(dto.validTo) : null,
        requiredQty: dto.requiredQty ?? 0,
        type: dto.type ?? 'item-discount',
        discountValue: dto.discountValue,
        discountType: dto.discountType ?? 'fixed',
        customerScope: dto.customerScope ?? 'all',
        unitType: dto.unitType ?? 'all',
        isActive: dto.isActive ?? true,
      },
    });

    return this.mapPriceOffer(created);
  }

  async updatePriceOffer(
    companyId: string,
    id: string,
    dto: UpdatePriceOfferDto,
  ): Promise<PriceOfferView> {
    await this.assertOfferOwnership(companyId, id);

    const data: {
      name?: string;
      validFrom?: Date | null;
      validTo?: Date | null;
      requiredQty?: number;
      type?: string;
      discountValue?: number;
      discountType?: string;
      customerScope?: string;
      unitType?: string;
      isActive?: boolean;
    } = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.validFrom !== undefined) {
      data.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    }

    if (dto.validTo !== undefined) {
      data.validTo = dto.validTo ? new Date(dto.validTo) : null;
    }

    if (dto.requiredQty !== undefined) {
      data.requiredQty = dto.requiredQty;
    }

    if (dto.type !== undefined) {
      data.type = dto.type;
    }

    if (dto.discountValue !== undefined) {
      data.discountValue = dto.discountValue;
    }

    if (dto.discountType !== undefined) {
      data.discountType = dto.discountType;
    }

    if (dto.customerScope !== undefined) {
      data.customerScope = dto.customerScope;
    }

    if (dto.unitType !== undefined) {
      data.unitType = dto.unitType;
    }

    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      const current = await this.prisma.salesPriceOffer.findUnique({ where: { id } });
      if (!current) {
        throw new NotFoundException('Offer not found');
      }
      return this.mapPriceOffer(current);
    }

    const updated = await this.prisma.salesPriceOffer.update({
      where: { id },
      data,
    });

    return this.mapPriceOffer(updated);
  }

  async deletePriceOffer(companyId: string, id: string): Promise<{ success: true }> {
    const result = await this.prisma.salesPriceOffer.deleteMany({
      where: { companyId, id },
    });

    if (result.count === 0) {
      throw new NotFoundException('Offer not found');
    }

    return { success: true };
  }
}
