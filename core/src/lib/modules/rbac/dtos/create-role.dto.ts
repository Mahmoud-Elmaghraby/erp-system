import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Sales Manager' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الدور مطلوب' })
  name!: string;

  @ApiPropertyOptional({ example: 'Manages sales operations' })
  @IsString()
  @IsOptional()
  description?: string;
}