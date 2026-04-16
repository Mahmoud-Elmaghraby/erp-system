import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'فرع المعادي' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الفرع مطلوب' })
  name!: string;

  @ApiPropertyOptional({ example: 'المعادي، القاهرة' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '01012345678' })
  @IsString()
  @IsOptional()
  phone?: string;
}