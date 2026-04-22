import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../rbac/permission.guard';
import { RequirePermission } from '../../rbac/require-permission.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CompanySettingsService } from './company-settings.service';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';

@ApiTags('Company Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('company-settings')
export class CompanySettingsController {
  constructor(private companySettingsService: CompanySettingsService) {}

  @Get()
  @RequirePermission('core.settings.view')
  @ApiOperation({ summary: 'Get company settings' })
  getSettings(@CurrentUser('companyId') companyId: string) {
    return this.companySettingsService.getSettings(companyId);
  }

  @Patch()
  @RequirePermission('core.settings.edit')
  @ApiOperation({ summary: 'Update company settings' })
  updateSettings(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateCompanySettingsDto,
  ) {
    return this.companySettingsService.updateSettings(companyId, dto);
  }
}