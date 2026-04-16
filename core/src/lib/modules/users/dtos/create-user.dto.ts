import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Mohamed' })
  @IsString()
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  name!: string;

  @ApiProperty({ example: 'ahmed@company.com' })
  @IsEmail({}, { message: 'بريد إلكتروني غير صحيح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email!: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8, { message: 'كلمة المرور لا تقل عن 8 أحرف' })
  password!: string;

  @ApiPropertyOptional()
  @IsUUID('4', { message: 'معرف الفرع غير صالح' })
  @IsOptional()
  branchId?: string;
}