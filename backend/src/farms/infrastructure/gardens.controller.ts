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
import { GardensService } from '../application/gardens.service';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/roles.guard';
import { Roles } from '../../auth/infrastructure/roles.decorator';
import { CreateGardenDto, UpdateGardenDto } from '../application/dto/garden.dto';
import { CreateTreeBatchDto } from '../application/dto/tree-batch.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Gardens & TreeBatches')
@ApiBearerAuth()
@Controller('farms/:farmId/gardens')
@UseGuards(JwtAuthGuard)
export class GardensController {
  constructor(private readonly gardensService: GardensService) {}

  /** GARDENS */
  @ApiOperation({ summary: 'Tạo vườn mới' })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.ADMIN)
  createGarden(
    @Param('farmId') farmId: string,
    @Body() dto: CreateGardenDto,
    @Request() req: any,
  ) {
    return this.gardensService.createGarden(farmId, req.user.userId, req.user.role, dto);
  }

  @ApiOperation({ summary: 'Danh sách vườn' })
  @Get()
  findGardens(@Param('farmId') farmId: string, @Request() req: any) {
    return this.gardensService.findGardens(farmId, req.user.userId, req.user.role);
  }

  @ApiOperation({ summary: 'Chi tiết vườn' })
  @Get(':gardenId')
  findOneGarden(
    @Param('farmId') farmId: string,
    @Param('gardenId') gardenId: string,
    @Request() req: any,
  ) {
    return this.gardensService.findOneGarden(farmId, gardenId, req.user.userId, req.user.role);
  }

  @ApiOperation({ summary: 'Cập nhật vườn' })
  @Patch(':gardenId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.ADMIN)
  updateGarden(
    @Param('farmId') farmId: string,
    @Param('gardenId') gardenId: string,
    @Body() dto: UpdateGardenDto,
    @Request() req: any,
  ) {
    return this.gardensService.updateGarden(farmId, gardenId, req.user.userId, req.user.role, dto);
  }

  @ApiOperation({ summary: 'Xoá vườn' })
  @Delete(':gardenId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.ADMIN)
  removeGarden(
    @Param('farmId') farmId: string,
    @Param('gardenId') gardenId: string,
    @Request() req: any,
  ) {
    return this.gardensService.removeGarden(farmId, gardenId, req.user.userId, req.user.role);
  }

  /** TREE BATCHES */
  @ApiOperation({ summary: 'Tạo lô cây trong vườn' })
  @Post(':gardenId/tree-batches')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.ADMIN)
  createTreeBatch(
    @Param('farmId') farmId: string,
    @Param('gardenId') gardenId: string,
    @Body() dto: CreateTreeBatchDto,
    @Request() req: any,
  ) {
    return this.gardensService.createTreeBatch(farmId, gardenId, req.user.userId, req.user.role, dto);
  }

  @ApiOperation({ summary: 'Danh sách lô cây trong vườn' })
  @Get(':gardenId/tree-batches')
  findTreeBatches(
    @Param('farmId') farmId: string,
    @Param('gardenId') gardenId: string,
    @Request() req: any,
  ) {
    return this.gardensService.findTreeBatches(farmId, gardenId, req.user.userId, req.user.role);
  }
}
