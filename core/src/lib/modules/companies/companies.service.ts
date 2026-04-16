import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { branches: { where: { isActive: true } } },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(dto: CreateCompanyDto) {
    const exists = await this.prisma.company.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');

    return this.prisma.company.create({
      data: {
        ...dto,
        // ينشئ الفرع الرئيسي أوتوماتيك مع الشركة
        branches: {
          create: {
            name: 'الفرع الرئيسي',
            address: dto.address,
            phone: dto.phone,
          },
        },
      },
      include: { branches: true },
    });
  }

  async update(id: string, dto: UpdateCompanyDto) {
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data: dto,
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });
  }
}