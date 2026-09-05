import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateGardenDto {
  @ApiProperty({ description: 'Tên vườn' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Diện tích (ha)' })
  @IsNumber()
  @Min(0)
  area: number;
}

export class UpdateGardenDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  area?: number;
}
