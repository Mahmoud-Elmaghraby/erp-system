import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJournalItemDto {
  @ApiPropertyOptional() @IsString() @IsOptional()    id?: string;
  @ApiProperty()  @IsString() @IsNotEmpty()           name!: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional()    debit?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional()    credit?: number;
  @ApiProperty()  @IsString() @IsNotEmpty()           accountId!: string;
}

export class CreateJournalEntryDto {
  @ApiProperty() @IsString() @IsNotEmpty()  reference!: string;
  @ApiProperty() @IsString() @IsNotEmpty()  date!: string;
  @ApiProperty() @IsString() @IsNotEmpty()  journalId!: string;

  @ApiProperty({ type: [CreateJournalItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJournalItemDto)
  items!: CreateJournalItemDto[];
}

export class UpdateJournalEntryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() reference?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() date?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() journalId?: string;
}