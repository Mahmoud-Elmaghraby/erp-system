
import { RbacModule } from '../modules/rbac/rbac.module';
import { CompaniesController } from '../modules/companies/companies.controller';
import { CompaniesService } from '../modules/companies/companies.service';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { Module } from '@nestjs/common';



@Module({
  imports: [RbacModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService],
  exports: [CompaniesService],
})
export class CompaniesModule {}