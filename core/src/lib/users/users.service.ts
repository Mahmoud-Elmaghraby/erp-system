import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, companyId: true, branchId: true, createdAt: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, companyId: true, branchId: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: { name: string; email: string; password: string; companyId: string; branchId?: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email already exists');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, name: true, email: true, companyId: true, branchId: true, createdAt: true },
    });
  }

  async update(id: string, data: { name?: string; branchId?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, companyId: true, branchId: true },
    });
  }

  async remove(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: false } });
  }
}