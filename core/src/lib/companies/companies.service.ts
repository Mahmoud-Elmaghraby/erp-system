import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { branches: true },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: { name: string; email: string; phone?: string; address?: string }) {
    return this.prisma.company.create({
      data: {
        ...data,
        branches: {
          create: {
            name: 'الفرع الرئيسي',
            address: data.address,
            phone: data.phone,
          },
        },
      },
      include: { branches: true },
    });
  }

  async update(id: string, data: { name?: string; phone?: string; address?: string }) {
    return this.prisma.company.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.company.update({ where: { id }, data: { isActive: false } });
  }
}