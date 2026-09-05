import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum JournalWorkType { FERTILIZE = 'FERTILIZE', PESTICIDE = 'PESTICIDE', WATER = 'WATER', PRUNE = 'PRUNE', HARVEST = 'HARVEST', OTHER = 'OTHER' }

export class JournalMaterialDto {
  @IsUUID() materialId: string;
  @IsNumber() @Min(0.0001) quantityUsed: number;
}

export class CreateJournalDto {
  @IsUUID() @IsOptional() farmId?: string;
  @IsUUID() @IsOptional() plotId?: string;
  @IsUUID() @IsOptional() cropCycleId?: string;
  @IsDateString() date: string;
  @IsEnum(JournalWorkType) workType: JournalWorkType;
  @IsString() @IsOptional() description?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() photos?: string[];
  @IsArray() @ValidateNested({ each: true }) @Type(() => JournalMaterialDto) @IsOptional() materials?: JournalMaterialDto[];
}

export class JournalHistoryQueryDto {
  @IsUUID() @IsOptional() farmId?: string;
  @IsUUID() @IsOptional() cropCycleId?: string;
  @IsUUID() @IsOptional() cropId?: string;
  @IsDateString() @IsOptional() from?: string;
  @IsDateString() @IsOptional() to?: string;
  @IsEnum(JournalWorkType) @IsOptional() workType?: JournalWorkType;
}

export class JournalOptionsQueryDto { @IsUUID() @IsOptional() farmId?: string; }

export class JournalUploadDto { @IsArray() @IsString({ each: true }) photos: string[]; }
