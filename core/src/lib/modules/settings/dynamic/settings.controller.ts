import {
  Controller, Get, Put, Body,
  Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../rbac/permission.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SettingsService } from './settings.service';

@ApiTags('Module Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all module settings' })
  getAll(@CurrentUser('companyId') companyId: string) {
    return this.settingsService.getAvailableModules(companyId);
  }

  @Get(':module')
  @ApiOperation({ summary: 'Get specific module settings' })
  getModule(
    @CurrentUser('companyId') companyId: string,
    @Param('module') module: string,
  ) {
    return this.settingsService.getModuleSettings(companyId, module);
  }

  @Put(':module')
  @ApiOperation({ summary: 'Update module settings' })
  updateModule(
    @CurrentUser('companyId') companyId: string,
    @Param('module') module: string,
    @Body() values: Record<string, any>,
  ) {
    return this.settingsService.updateModuleSettings(companyId, module, values);
  }
}