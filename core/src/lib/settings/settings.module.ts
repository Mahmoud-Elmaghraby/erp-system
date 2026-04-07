import { Module, Global } from '@nestjs/common';
import { SettingsRegistry } from './settings.registry';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '../prisma.service';

@Global()
@Module({
  controllers: [SettingsController],
  providers: [PrismaService, SettingsRegistry, SettingsService],
  exports: [SettingsRegistry, SettingsService],
})
export class SettingsModule {}