import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Ahmed Mohamed' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'NewPassword@123' })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'كلمة المرور لا تقل عن 8 أحرف' })
  password?: string;

  @ApiPropertyOptional()
  @IsUUID('4', { message: 'معرف الفرع غير صالح' })
  @IsOptional()
  branchId?: string;
}