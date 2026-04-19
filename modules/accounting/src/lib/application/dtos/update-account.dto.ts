import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountCategory, AccountRole, NormalBalance } from '../../domain/types/account.types';

export class UpdateAccountDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AccountCategory)
  category?: AccountCategory;

  @IsOptional()
  @IsEnum(AccountRole)
  role?: AccountRole;

  @IsOptional()
  @IsEnum(NormalBalance)
  normalBalance?: NormalBalance;

  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}