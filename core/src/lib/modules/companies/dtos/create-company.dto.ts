import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'My Company' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الشركة مطلوب' })
  name!: string;

  @ApiProperty({ example: 'company@email.com' })
  @IsEmail({}, { message: 'بريد إلكتروني غير صحيح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email!: string;

  @ApiPropertyOptional({ example: '01012345678' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Cairo, Egypt' })
  @IsString()
  @IsOptional()
  address?: string;
}