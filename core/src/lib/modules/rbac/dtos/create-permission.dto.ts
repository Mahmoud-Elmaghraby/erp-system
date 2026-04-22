import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'sales.orders.create' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الصلاحية مطلوب' })
  name!: string;

  @ApiProperty({ example: 'sales' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الموديول مطلوب' })
  module!: string;

  @ApiPropertyOptional({ example: 'Can create sales orders' })
  @IsString()
  @IsOptional()
  description?: string;
}