import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get(':companyId')
  getAll(@Param('companyId') companyId: string) {
    return this.settingsService.getAvailableModules(companyId);
  }

  @Get(':companyId/:module')
  getModule(
    @Param('companyId') companyId: string,
    @Param('module') module: string,
  ) {
    return this.settingsService.getModuleSettings(companyId, module);
  }

  @Put(':companyId/:module')
  updateModule(
    @Param('companyId') companyId: string,
    @Param('module') module: string,
    @Body() values: Record<string, any>,
  ) {
    return this.settingsService.updateModuleSettings(companyId, module, values);
  }
}