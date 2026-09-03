import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';
import { CreatePlotDto, UpdatePlotDto } from './dto/plot.dto';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lấy tất cả nông hộ của user đang đăng nhập */
  async findMyFarms(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId, deletedAt: null },
      include: {
        plots: {
          where: { deletedAt: null },
          select: { id: true, name: true, area: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Lấy tất cả nông hộ (chỉ ADMIN) */
  async findAll() {
    return this.prisma.farm.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        plots: {
          where: { deletedAt: null },
          select: { id: true, name: true, area: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Tạo nông hộ mới */
  async create(userId: string, dto: CreateFarmDto) {
    return this.prisma.farm.create({
      data: { userId, ...dto },
    });
  }

  /** Xem chi tiết 1 nông hộ */
  async findOne(id: string, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({
      where: { id, deletedAt: null },
      include: {
        plots: { where: { deletedAt: null } },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xem nông hộ này');
    }
    return farm;
  }

  /** Cập nhật nông hộ */
  async update(id: string, dto: UpdateFarmDto, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({ where: { id, deletedAt: null } });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa nông hộ này');
    }
    return this.prisma.farm.update({ where: { id }, data: dto });
  }

  /** Xóa mềm nông hộ */
  async remove(id: string, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({ where: { id, deletedAt: null } });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa nông hộ này');
    }
    return this.prisma.farm.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, name: true },
    });
  }

  // ==========================================
  // PLOT CRUD
  // ==========================================

  /** Kiểm tra quyền sở hữu farm */
  private async checkFarmOwnership(farmId: string, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({
      where: { id: farmId, deletedAt: null },
    });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền thao tác trên nông hộ này');
    }
    return farm;
  }

  /** Tạo lô trồng mới */
  async createPlot(farmId: string, userId: string, role: string, dto: CreatePlotDto) {
    await this.checkFarmOwnership(farmId, userId, role);
    return this.prisma.plot.create({
      data: {
        farmId,
        ...dto,
      },
    });
  }

  /** Lấy danh sách lô trồng của 1 nông hộ */
  async findPlots(farmId: string, userId: string, role: string) {
    await this.checkFarmOwnership(farmId, userId, role);
    return this.prisma.plot.findMany({
      where: { farmId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Lấy chi tiết 1 lô trồng */
  async findOnePlot(farmId: string, plotId: string, userId: string, role: string) {
    await this.checkFarmOwnership(farmId, userId, role);
    const plot = await this.prisma.plot.findFirst({
      where: { id: plotId, farmId, deletedAt: null },
    });
    if (!plot) throw new NotFoundException('Lô trồng không tồn tại');
    return plot;
  }

  /** Cập nhật lô trồng */
  async updatePlot(farmId: string, plotId: string, userId: string, role: string, dto: UpdatePlotDto) {
    await this.checkFarmOwnership(farmId, userId, role);
    const plot = await this.prisma.plot.findFirst({
      where: { id: plotId, farmId, deletedAt: null },
    });
    if (!plot) throw new NotFoundException('Lô trồng không tồn tại');
    return this.prisma.plot.update({
      where: { id: plotId },
      data: dto,
    });
  }

  /** Xóa mềm lô trồng */
  async removePlot(farmId: string, plotId: string, userId: string, role: string) {
    await this.checkFarmOwnership(farmId, userId, role);
    const plot = await this.prisma.plot.findFirst({
      where: { id: plotId, farmId, deletedAt: null },
    });
    if (!plot) throw new NotFoundException('Lô trồng không tồn tại');
    
    // Check nếu lô có CropCycle thì không cho xóa (tùy nghiệp vụ, ở đây cứ xóa mềm)
    return this.prisma.plot.update({
      where: { id: plotId },
      data: { deletedAt: new Date() },
    });
  }
}
