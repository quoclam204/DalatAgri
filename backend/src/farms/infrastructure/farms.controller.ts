import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FarmsService } from '../application/farms.service';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/roles.guard';
import { Roles } from '../../auth/infrastructure/roles.decorator';
import { CreateFarmDto, UpdateFarmDto } from '../application/dto/farm.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Farms')
@ApiBearerAuth()
@Controller('farms')
@UseGuards(JwtAuthGuard)
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @ApiOperation({ summary: 'Lấy danh sách nông hộ của tôi' })
  @Get()
  getMyFarms(@Request() req: any) {
    return this.farmsService.findMyFarms(req.user.userId, req.user.role);
  }

  @ApiOperation({ summary: 'Lấy tất cả nông hộ (Chỉ ADMIN)' })
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.farmsService.findAll();
  }

  @ApiOperation({ summary: 'Tạo nông hộ mới' })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@Request() req: any, @Body() dto: CreateFarmDto) {
    return this.farmsService.create(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Chi tiết nông hộ' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.farmsService.findOne(id, req.user.userId, req.user.role);
  }

  @ApiOperation({ summary: 'Cập nhật nông hộ' })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmDto,
    @Request() req: any,
  ) {
    return this.farmsService.update(id, dto, req.user.userId, req.user.role);
  }

  @ApiOperation({ summary: 'Xoá nông hộ' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.farmsService.remove(id, req.user.userId, req.user.role);
  }
}
