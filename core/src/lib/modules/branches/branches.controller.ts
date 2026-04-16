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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.dto';
import { PaginationDto } from '../../shared/common/dto/pagination.dto';

@ApiTags('Branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all branches in my company' })
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.branchesService.findAll(companyId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch by id' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.branchesService.findOne(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new branch' })
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateBranchDto,
  ) {
    return this.branchesService.create(companyId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update branch' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchesService.update(id, companyId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate branch (soft delete)' })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.branchesService.deactivate(id, companyId);
  }
}