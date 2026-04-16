import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { DocumentSequenceService } from './document-sequence.service';

export class UpdateSequenceDto {
  @ApiPropertyOptional() @IsString() @IsOptional()
  prefix?: string;

  @ApiPropertyOptional() @IsInt() @Min(1) @IsOptional()
  padding?: number;
}

@ApiTags('Document Sequences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('document-sequences')
export class DocumentSequenceController {
  constructor(private documentSequenceService: DocumentSequenceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all document sequences' })
  getAll(@CurrentUser('companyId') companyId: string) {
    return this.documentSequenceService.getSequences(companyId);
  }

  @Patch(':module/:docType')
  @ApiOperation({ summary: 'Update document sequence' })
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('module') module: string,
    @Param('docType') docType: string,
    @Body() dto: UpdateSequenceDto,
  ) {
    return this.documentSequenceService.updateSequence(companyId, module, docType, dto);
  }
}