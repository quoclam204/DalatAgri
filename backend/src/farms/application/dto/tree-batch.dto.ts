import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateTreeBatchDto {
  @ApiProperty({ description: 'ID của loại cây trồng (CropType)' })
  @IsUUID()
  cropTypeId: string;

  @ApiProperty({ description: 'Tên lô trồng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Ngày bắt đầu trồng' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Ngày dự kiến thu hoạch' })
  @IsDateString()
  expectedEndDate: string;

  @ApiProperty({ description: 'Trạng thái (PLANTED, HARVESTING, DONE)' })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class UpdateTreeBatchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expectedEndDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Tổng sản lượng thu hoạch được' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalYield?: number;
}
