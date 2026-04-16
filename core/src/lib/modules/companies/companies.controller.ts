import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { PermissionGuard } from '../rbac/permission.guard';
import { RequirePermission } from '../rbac/require-permission.decorator';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  // ✅ يجيب شركته هو بس من الـ JWT
  @Get('me')
  @ApiOperation({ summary: 'Get my company details' })
  getMyCompany(@CurrentUser('companyId') companyId: string) {
    return this.companiesService.findOne(companyId);
  }


@Post()
@UseGuards(JwtAuthGuard, PermissionGuard)   // ✅ أضف
@RequirePermission('core.companies.create') // ✅ أضف
@ApiOperation({ summary: 'Create new company' })
create(@Body() dto: CreateCompanyDto) {
  return this.companiesService.create(dto);
}

  // ✅ يعدل شركته هو بس
  @Patch('me')
  @ApiOperation({ summary: 'Update my company' })
  updateMyCompany(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(companyId, dto);
  }

  // للـ Super Admin بس
@Patch(':id')
@UseGuards(JwtAuthGuard, PermissionGuard)      // ✅ أضف
@RequirePermission('core.companies.manage')    // ✅ أضف
@ApiOperation({ summary: 'Update company by id (super admin)' })
update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCompanyDto) {
  return this.companiesService.update(id, dto);
}

 @Delete(':id')
@UseGuards(JwtAuthGuard, PermissionGuard)      // ✅ أضف
@RequirePermission('core.companies.manage')    // ✅ أضف
@ApiOperation({ summary: 'Deactivate company (super admin)' })
deactivate(@Param('id', ParseUUIDPipe) id: string) {
  return this.companiesService.deactivate(id);
}
}