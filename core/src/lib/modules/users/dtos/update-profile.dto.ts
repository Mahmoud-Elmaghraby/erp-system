import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Ahmed Mohamed' })
  @IsString() @IsOptional()
  name?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  @MinLength(8, { message: 'كلمة المرور لا تقل عن 8 أحرف' })
  currentPassword!: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  @MinLength(8, { message: 'كلمة المرور الجديدة لا تقل عن 8 أحرف' })
  newPassword!: string;
}