import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const ACTIVITY_TYPES = [
  'LAND_PREPARATION',
  'WATERING',
  'FERTILIZING',
  'PESTICIDE',
  'PRUNING',
  'HARVEST',
  'OTHER',
] as const;

export class CreateActivityLogDto {
  @ApiPropertyOptional({ description: 'ID của vườn', example: 'uuid-garden' })
  @IsOptional()
  @IsUUID()
  gardenId?: string;

  @ApiProperty({ description: 'ID của mùa vụ (treeBatch)', example: 'uuid-tree-batch' })
  @IsUUID()
  treeBatchId: string;

  @ApiProperty({ enum: ACTIVITY_TYPES, description: 'Loại hình công việc', example: 'FERTILIZING' })
  @IsIn(ACTIVITY_TYPES)
  activityType: string;

  @ApiProperty({ description: 'Ngày thực hiện công việc (YYYY-MM-DD)', example: '2026-09-05' })
  @IsDateString()
  activityDate: string;

  @ApiPropertyOptional({ description: 'Ghi chú thêm', maxLength: 2000, example: 'Bón phân lân' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Chi phí phát sinh', example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({ description: 'Sản lượng thu hoạch (chỉ dành cho loại HARVEST)', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  harvestQuantity?: number;

  @ApiPropertyOptional({ description: 'Doanh thu (chỉ dành cho loại HARVEST)', example: 2000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  revenue?: number;

  @ApiPropertyOptional({ description: 'Danh sách URL hình ảnh đính kèm (hoặc Base64 arrays)', type: [String], example: ['data:image/jpeg;base64,...'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class UpdateActivityLogDto {
  @ApiPropertyOptional({ enum: ACTIVITY_TYPES })
  @IsOptional()
  @IsIn(ACTIVITY_TYPES)
  activityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  activityDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  harvestQuantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  revenue?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class ActivityLogQueryDto {
  @ApiPropertyOptional({ description: 'Lọc theo ID lô cây (treeBatchId)' })
  @IsOptional()
  @IsUUID()
  treeBatchId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID Vườn (gardenId)' })
  @IsOptional()
  @IsUUID()
  gardenId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo loại cây trồng (cropTypeId)' })
  @IsOptional()
  @IsUUID()
  cropTypeId?: string;

  @ApiPropertyOptional({ enum: ACTIVITY_TYPES, description: 'Lọc theo loại công việc' })
  @IsOptional()
  @IsIn(ACTIVITY_TYPES)
  activityType?: string;

  @ApiPropertyOptional({ description: 'Từ ngày (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'Đến ngày (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
