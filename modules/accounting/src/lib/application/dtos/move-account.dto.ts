import { IsOptional, IsUUID } from 'class-validator';

export class MoveAccountDto {

  @IsOptional()
  @IsUUID()
  parentId?: string | null;
}