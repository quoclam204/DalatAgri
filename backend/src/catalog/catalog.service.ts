import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  findFarms() {
    return this.prisma.farm.findMany({
      where: { deletedAt: null },
      include: { plots: { where: { deletedAt: null } } },
    });
  }
  async createFarm(input: any) {
    this.requirePositive(input.totalArea, 'totalArea');
    await this.requireUser(input.userId);
    return this.prisma.farm.create({
      data: {
        userId: input.userId,
        name: this.text(input.name, 'name'),
        location: this.text(input.location, 'location'),
        totalArea: Number(input.totalArea),
      },
    });
  }
  async updateFarm(id: string, input: any) {
    if (input.totalArea !== undefined) {
      this.requirePositive(input.totalArea, 'totalArea');
      const usedArea = await this.prisma.plot.aggregate({
        where: { farmId: id, deletedAt: null },
        _sum: { area: true },
      });
      if ((usedArea._sum.area || 0) > Number(input.totalArea))
        throw new BadRequestException(
          'Diện tích vườn không đủ cho các lô hiện có',
        );
    }
    return this.prisma.farm.update({
      where: { id },
      data: this.pick(input, ['name', 'location', 'totalArea']),
    });
  }
  async deleteFarm(id: string) {
    if (await this.hasChildren('plot', { farmId: id }))
      throw new ConflictException('Không thể xóa vườn đã có lô');
    return this.softDelete(this.prisma.farm, id);
  }

  findPlots() {
    return this.prisma.plot.findMany({
      where: { deletedAt: null },
      include: { farm: true },
    });
  }
  async createPlot(input: any) {
    this.requirePositive(input.area, 'area');
    const farm = await this.prisma.farm.findFirst({
      where: { id: input.farmId, deletedAt: null },
    });
    if (!farm) throw new NotFoundException('Không tìm thấy vườn');
    const usedArea = await this.prisma.plot.aggregate({
      where: { farmId: input.farmId, deletedAt: null },
      _sum: { area: true },
    });
    if ((usedArea._sum.area || 0) + Number(input.area) > farm.totalArea)
      throw new BadRequestException(
        'Tổng diện tích các lô vượt quá diện tích vườn',
      );
    return this.prisma.plot.create({
      data: {
        farmId: input.farmId,
        name: this.text(input.name, 'name'),
        area: Number(input.area),
      },
    });
  }
  async updatePlot(id: string, input: any) {
    if (input.area !== undefined) {
      this.requirePositive(input.area, 'area');
      const plot = await this.prisma.plot.findUnique({ where: { id } });
      if (!plot) throw new NotFoundException('Không tìm thấy lô trồng');
      const farm = await this.prisma.farm.findUnique({
        where: { id: plot.farmId },
      });
      const otherArea = await this.prisma.plot.aggregate({
        where: { farmId: plot.farmId, id: { not: id }, deletedAt: null },
        _sum: { area: true },
      });
      if (
        farm &&
        (otherArea._sum.area || 0) + Number(input.area) > farm.totalArea
      )
        throw new BadRequestException(
          'Tổng diện tích các lô vượt quá diện tích vườn',
        );
    }
    return this.prisma.plot.update({
      where: { id },
      data: this.pick(input, ['name', 'area']),
    });
  }
  async deletePlot(id: string) {
    if (await this.hasChildren('cropCycle', { plotId: id }))
      throw new ConflictException('Không thể xóa lô đã có mùa vụ');
    return this.softDelete(this.prisma.plot, id);
  }

  findCrops() {
    return this.prisma.crop.findMany({
      where: { deletedAt: null },
      include: {
        growthCycles: {
          where: { deletedAt: null },
          include: {
            stages: {
              where: { deletedAt: null },
              orderBy: { sequence: 'asc' },
            },
          },
        },
      },
    });
  }
  createCrop(input: any) {
    return this.prisma.crop.create({
      data: {
        name: this.text(input.name, 'name'),
        type: this.text(input.type, 'type'),
      },
    });
  }
  updateCrop(id: string, input: any) {
    return this.prisma.crop.update({
      where: { id },
      data: this.pick(input, ['name', 'type']),
    });
  }
  async deleteCrop(id: string) {
    if (await this.hasChildren('cropCycle', { cropId: id }))
      throw new ConflictException('Không thể xóa cây trồng đã có mùa vụ');
    return this.softDelete(this.prisma.crop, id);
  }

  findGrowthCycles() {
    return this.prisma.growthCycle.findMany({
      where: { deletedAt: null },
      include: {
        crop: true,
        stages: { where: { deletedAt: null }, orderBy: { sequence: 'asc' } },
      },
    });
  }
  async createGrowthCycle(input: any) {
    const crop = await this.prisma.crop.findFirst({
      where: { id: input.cropId, deletedAt: null },
    });
    if (!crop) throw new NotFoundException('Không tìm thấy cây trồng');
    const stages = input.stages || [];
    if (!stages.length)
      throw new BadRequestException('Chu kỳ phải có ít nhất một giai đoạn');
    return this.prisma.growthCycle.create({
      data: {
        cropId: input.cropId,
        name: this.text(input.name, 'name'),
        description: input.description,
        stages: {
          create: stages.map((stage: any, index: number) => ({
            name: this.text(stage.name, 'stage.name'),
            sequence: stage.sequence ?? index + 1,
            durationDays: this.positiveInteger(
              stage.durationDays,
              'durationDays',
            ),
            description: stage.description,
          })),
        },
      },
      include: { stages: true },
    });
  }

  findSeasons() {
    return this.prisma.cropCycle.findMany({
      where: { deletedAt: null },
      include: {
        plot: true,
        crop: true,
        growthCycle: { include: { stages: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }
  async createSeason(input: any) {
    const dates = this.dates(input.startDate, input.expectedEndDate);
    const plot = await this.prisma.plot.findFirst({
      where: { id: input.plotId, deletedAt: null },
    });
    const crop = await this.prisma.crop.findFirst({
      where: { id: input.cropId, deletedAt: null },
    });
    if (!plot) throw new NotFoundException('Không tìm thấy lô trồng');
    if (!crop) throw new NotFoundException('Không tìm thấy cây trồng');
    if (
      input.growthCycleId &&
      !(await this.prisma.growthCycle.findFirst({
        where: {
          id: input.growthCycleId,
          cropId: input.cropId,
          deletedAt: null,
        },
      }))
    )
      throw new BadRequestException('Chu kỳ không thuộc cây trồng đã chọn');
    const overlap = await this.prisma.cropCycle.findFirst({
      where: {
        plotId: input.plotId,
        deletedAt: null,
        startDate: { lte: dates.end },
        expectedEndDate: { gte: dates.start },
        status: { not: 'CANCELLED' },
      },
    });
    if (overlap)
      throw new ConflictException('Mùa vụ bị trùng thời gian trên lô này');
    return this.prisma.cropCycle.create({
      data: {
        plotId: input.plotId,
        cropId: input.cropId,
        growthCycleId: input.growthCycleId,
        name: this.text(input.name, 'name'),
        startDate: dates.start,
        expectedEndDate: dates.end,
        status: input.status || 'PLANNED',
      },
    });
  }
  async updateSeason(id: string, input: any) {
    const dates =
      input.startDate || input.expectedEndDate
        ? this.dates(input.startDate, input.expectedEndDate)
        : undefined;
    return this.prisma.cropCycle.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name.trim() }),
        ...(input.status && { status: input.status }),
        ...(dates && { startDate: dates.start, expectedEndDate: dates.end }),
      },
    });
  }
  deleteSeason(id: string) {
    return this.softDelete(this.prisma.cropCycle, id);
  }

  private text(value: any, field: string) {
    if (typeof value !== 'string' || !value.trim())
      throw new BadRequestException(`${field} là bắt buộc`);
    return value.trim();
  }
  private requirePositive(value: any, field: string) {
    if (!Number.isFinite(Number(value)) || Number(value) <= 0)
      throw new BadRequestException(`${field} phải lớn hơn 0`);
  }
  private positiveInteger(value: any, field: string) {
    this.requirePositive(value, field);
    return Math.floor(Number(value));
  }
  private dates(start: any, end: any) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate > endDate
    )
      throw new BadRequestException('Khoảng thời gian mùa vụ không hợp lệ');
    return { start: startDate, end: endDate };
  }
  private pick(input: any, fields: string[]) {
    return Object.fromEntries(
      fields
        .filter((field) => input[field] !== undefined)
        .map((field) => [
          field,
          field === 'area' || field === 'totalArea'
            ? Number(input[field])
            : typeof input[field] === 'string'
              ? input[field].trim()
              : input[field],
        ]),
    );
  }
  private async requireUser(id: string) {
    if (!id || !(await this.prisma.user.findUnique({ where: { id } })))
      throw new NotFoundException('Không tìm thấy người dùng');
  }
  private async hasChildren(model: any, where: any) {
    return (await model.count({ where: { ...where, deletedAt: null } })) > 0;
  }
  private softDelete(model: any, id: string) {
    return model.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
