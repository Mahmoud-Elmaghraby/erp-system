import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IPriceListRepository } from '../../../domain/repositories/price-list.repository.interface';
import { PRICE_LIST_REPOSITORY } from '../../../domain/repositories/price-list.repository.interface';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface';
import { CsvParserService } from '../../../infrastructure/services/csv-parser.service';

export interface ImportResult {
  imported: number;
  skipped: { row: number; sku: string; reason: string }[];
}

@Injectable()
export class ImportCsvToPriceListUseCase {
  constructor(
    @Inject(PRICE_LIST_REPOSITORY)
    private readonly priceListRepository: IPriceListRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly csvParserService: CsvParserService,
  ) {}

  async execute(priceListId: string, file: { buffer: Buffer }, companyId: string): Promise<ImportResult> {
    if (!file || !file.buffer) {
      throw new BadRequestException('CSV file is required');
    }

    const rows = this.csvParserService.parse(file.buffer);

    if (rows.length === 0) {
      throw new BadRequestException('CSV file is empty or has no valid rows');
    }

    const itemsToUpsert: { productId: string; customPrice: number; defaultPrice: number }[] = [];
    const skipped: { row: number; sku: string; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 for 1-indexed + header row

      if (!row.sku || row.sku.trim() === '') {
        skipped.push({ row: rowNumber, sku: '', reason: 'Missing SKU' });
        continue;
      }

      if (isNaN(row.price) || row.price < 0) {
        skipped.push({ row: rowNumber, sku: row.sku, reason: 'Invalid price' });
        continue;
      }

      const product = await this.productRepository.findBySku(row.sku.trim(), companyId);
      if (!product) {
        skipped.push({ row: rowNumber, sku: row.sku, reason: 'Product not found' });
        continue;
      }

      itemsToUpsert.push({
        productId: product.id,
        customPrice: row.price,
        defaultPrice: product.price.getAmount(),
      });
    }

    let imported = 0;
    if (itemsToUpsert.length > 0) {
      imported = await this.priceListRepository.upsertItems(priceListId, itemsToUpsert);
    }

    return { imported, skipped };
  }
}
