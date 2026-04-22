import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  taxRegNumber?: string;

  @IsOptional()
  @IsString()
  commercialReg?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsIn(['B', 'P'])
  buyerType?: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  taxRegNumber?: string;

  @IsOptional()
  @IsString()
  commercialReg?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsIn(['B', 'P'])
  buyerType?: string;
}