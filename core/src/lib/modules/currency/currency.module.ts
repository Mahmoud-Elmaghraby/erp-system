import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RbacModule } from '../rbac/rbac.module'; // ✅

@Module({
  imports: [RbacModule], // ✅
  controllers: [CurrencyController],
  providers: [CurrencyService, PrismaService],
  exports: [CurrencyService],
})
export class CurrencyModule {}