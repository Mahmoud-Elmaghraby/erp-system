import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateBranchDto {
  name!: string;
  companyId!: string;
  address?: string;
  phone?: string;
}

class UpdateBranchDto {
  name?: string;
  address?: string;
  phone?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Get('company/:companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.branchesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBranchDto) {
    return this.branchesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}