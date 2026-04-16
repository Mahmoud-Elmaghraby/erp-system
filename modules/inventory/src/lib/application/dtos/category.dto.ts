
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

