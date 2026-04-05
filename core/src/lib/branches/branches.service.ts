import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.branch.findMany({ where: { companyId, isActive: true } });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async create(data: { name: string; companyId: string; address?: string; phone?: string }) {
    return this.prisma.branch.create({ data });
  }

  async update(id: string, data: { name?: string; address?: string; phone?: string }) {
    return this.prisma.branch.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
  }
}