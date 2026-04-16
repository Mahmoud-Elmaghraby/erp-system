import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationDto } from '../../shared/common/dto/pagination.dto';
import { getPaginationParams, buildPaginatedResult } from '../../shared/common/helpers/paginate.helper';
import { ChangePasswordDto, UpdateProfileDto } from './dtos/update-profile.dto';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  companyId: true,
  branchId: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, pagination: PaginationDto) {
    const { skip, take, page, limit } = getPaginationParams(pagination);

    const where = {
      companyId,
      isActive: true,
      ...(pagination.search && {
        OR: [
          { name: { contains: pagination.search, mode: 'insensitive' as const } },
          { email: { contains: pagination.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const orderBy = pagination.sortBy
      ? { [pagination.sortBy]: pagination.sortOrder ?? 'desc' }
      : { createdAt: 'desc' as const };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, select: USER_SELECT, skip, take, orderBy }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginatedResult(data, total, page, limit);
  }

  async findOne(id: string, companyId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, companyId, isActive: true },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(companyId: string, dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashedPassword, companyId, branchId: dto.branchId },
      select: USER_SELECT,
    });
  }

  async update(id: string, companyId: string, dto: UpdateUserDto) {
    await this.findOne(id, companyId);
    const updateData: Record<string, unknown> = { name: dto.name, branchId: dto.branchId };
    if (dto.password) updateData['password'] = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.update({ where: { id }, data: updateData, select: USER_SELECT });
  }


async getProfile(userId: string, companyId: string) {
  return this.findOne(userId, companyId);
}

async updateProfile(userId: string, companyId: string, dto: UpdateProfileDto) {
  await this.findOne(userId, companyId);
  return this.prisma.user.update({
    where: { id: userId },
    data: { name: dto.name },
    select: USER_SELECT,
  });
}

async changePassword(userId: string, companyId: string, dto: ChangePasswordDto) {
  const user = await this.prisma.user.findFirst({
    where: { id: userId, companyId },
  });
  if (!user) throw new NotFoundException('User not found');

  const isValid = await bcrypt.compare(dto.currentPassword, user.password);
  if (!isValid) throw new BadRequestException('كلمة المرور الحالية غلط');

  await this.prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(dto.newPassword, 10) },
  });

  return { message: 'تم تغيير كلمة المرور بنجاح' };
}



  async deactivate(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });
  }
}