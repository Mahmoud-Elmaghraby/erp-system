import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.dto';
import { PaginationDto } from '../../shared/common/dto/pagination.dto';
import { getPaginationParams, buildPaginatedResult } from '../../shared/common/helpers/paginate.helper';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, pagination: PaginationDto) {
    const { skip, take, page, limit } = getPaginationParams(pagination);

    const where = {
      companyId,
      isActive: true,
      ...(pagination.search && {
        name: { contains: pagination.search, mode: 'insensitive' as const },
      }),
    };

    const orderBy = pagination.sortBy
      ? { [pagination.sortBy]: pagination.sortOrder ?? 'desc' }
      : { createdAt: 'desc' as const };

    const [data, total] = await Promise.all([
      this.prisma.branch.findMany({ where, skip, take, orderBy }),
      this.prisma.branch.count({ where }),
    ]);

    return buildPaginatedResult(data, total, page, limit);
  }

  async findOne(id: string, companyId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, companyId, isActive: true },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async create(companyId: string, dto: CreateBranchDto) {
    return this.prisma.branch.create({ data: { ...dto, companyId } });
  }

  async update(id: string, companyId: string, dto: UpdateBranchDto) {
    await this.findOne(id, companyId);
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async deactivate(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.branch.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });
  }
}