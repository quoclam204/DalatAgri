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
import { FarmsService } from './farms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';

@Controller('farms')
@UseGuards(JwtAuthGuard)
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  /** GET /farms - Nông hộ của tôi */
  @Get()
  getMyFarms(@Request() req: any) {
    return this.farmsService.findMyFarms(req.user.userId);
  }

  /** GET /farms/all - Tất cả nông hộ (ADMIN) */
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.farmsService.findAll();
  }

  /** POST /farms - Tạo nông hộ mới */
  @Post()
  create(@Request() req: any, @Body() dto: CreateFarmDto) {
    return this.farmsService.create(req.user.userId, dto);
  }

  /** GET /farms/:id - Chi tiết 1 nông hộ */
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.farmsService.findOne(id, req.user.userId, req.user.role);
  }

  /** PATCH /farms/:id - Cập nhật nông hộ */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmDto,
    @Request() req: any,
  ) {
    return this.farmsService.update(id, dto, req.user.userId, req.user.role);
  }

  /** DELETE /farms/:id - Xóa mềm nông hộ */
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.farmsService.remove(id, req.user.userId, req.user.role);
  }
}
