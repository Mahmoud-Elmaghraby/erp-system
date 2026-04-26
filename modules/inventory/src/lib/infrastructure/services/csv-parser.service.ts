import { Injectable } from '@nestjs/common';
import * as Papa from 'papaparse';

interface CsvRow {
  sku: string;
  price: number;
}

@Injectable()
export class CsvParserService {
  parse(buffer: Buffer): CsvRow[] {
    const content = buffer.toString('utf-8');
    const result = Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
    });

    return result.data
      .map((row) => ({
        sku: (row['sku'] ?? '').trim(),
        price: parseFloat(row['price'] ?? ''),
      }))
      .filter((row) => row.sku !== '' && !isNaN(row.price));
  }
}
