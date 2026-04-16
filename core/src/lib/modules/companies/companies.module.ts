import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [RbacModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService],
  exports: [CompaniesService],
})
export class CompaniesModule {}