// modules/accounting/src/lib/application/dtos/fiscal-year.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateFiscalYearDto {
  @ApiProperty({ example: 'السنة المالية 2026' })
  @IsString()
  @IsNotEmpty()
  name!: string;  // ✅ أضف !

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  startDate!: string;  // ✅ أضف !

  @ApiProperty({ example: '2026-12-31' })
  @IsDateString()
  endDate!: string;  // ✅ أضف !
}

export class UpdatePeriodStatusDto {
  @ApiProperty({ enum: ['OPEN', 'SOFT_LOCKED', 'HARD_LOCKED'] })
  @IsString()
  @IsNotEmpty()
  status!: 'OPEN' | 'SOFT_LOCKED' | 'HARD_LOCKED';  // ✅ أضف !
}