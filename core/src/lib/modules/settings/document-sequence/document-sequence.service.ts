import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class DocumentSequenceService {
  constructor(private prisma: PrismaService) {}

  async getNextNumber(
    companyId: string,
    module: string,
    docType: string,
    prefix: string,
  ): Promise<string> {
    const sequence = await this.prisma.documentSequence.upsert({
      where: { companyId_module_docType: { companyId, module, docType } },
      update: { nextNumber: { increment: 1 } },
      create: {
        id: randomUUID(),
        companyId, module, docType, prefix,
        padding: 5,
        nextNumber: 2,
      },
    });

    const number = String(sequence.nextNumber - 1).padStart(sequence.padding, '0');
    return `${sequence.prefix}-${number}`;
  }

  async getSequences(companyId: string) {
    return this.prisma.documentSequence.findMany({ where: { companyId } });
  }

  async updateSequence(
    companyId: string,
    module: string,
    docType: string,
    data: { prefix?: string; padding?: number },
  ): Promise<void> {
    await this.prisma.documentSequence.updateMany({
      where: { companyId, module, docType },
      data,
    });
  }

  async resetSequence(
    companyId: string,
    module: string,
    docType: string,
  ): Promise<void> {
    await this.prisma.documentSequence.updateMany({
      where: { companyId, module, docType },
      data: { nextNumber: 1 },
    });
  }
}