import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({ description: 'Tên nông hộ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Vị trí địa lý' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Tổng diện tích (ha)' })
  @IsNumber()
  @Min(0)
  totalArea: number;
}

export class UpdateFarmDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalArea?: number;
}
