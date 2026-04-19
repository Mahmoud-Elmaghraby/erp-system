import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AccountCategory, AccountRole, NormalBalance } from '../../domain/types/account.types';

export class CreateAccountDto {

  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsEnum(AccountCategory)
  category!: AccountCategory;

  @IsEnum(NormalBalance)
  normalBalance!: NormalBalance;

  @IsOptional()
  @IsEnum(AccountRole)
  role?: AccountRole;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;
}