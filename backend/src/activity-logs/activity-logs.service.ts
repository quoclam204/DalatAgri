import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ActivityLogQueryDto,
  CreateActivityLogDto,
  UpdateActivityLogDto,
} from './dto/activity-log.dto';

const activityLogInclude = {
  treeBatch: {
    include: {
      garden: {
        include: {
          farm: { select: { id: true, name: true, userId: true } },
        },
      },
      CropTypeType: { select: { id: true, name: true, type: true } },
    },
  },
  materials: {
    where: { deletedAt: null },
    include: { material: { select: { id: true, name: true, unit: true } } },
  },
} as const;

@Injectable()
export class ActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string | undefined, role: string | undefined, query: ActivityLogQueryDto) {
    const where = {
      deletedAt: null,
      ...(query.treeBatchId && { treeBatchId: query.treeBatchId }),
      ...(query.activityType && { activityType: query.activityType }),
      ...(query.from || query.to
        ? {
            activityDate: {
              ...(query.from && { gte: new Date(query.from) }),
              ...(query.to && { lte: this.endOfDay(query.to) }),
            },
          }
        : {}),
      treeBatch: {
        ...(query.gardenId && { gardenId: query.gardenId }),
        ...(query.cropTypeId && { cropTypeId: query.cropTypeId }),
        garden: {
          farm: !userId || role === 'ADMIN' ? {} : { userId },
        },
      },
    };

    return this.prisma.activityLog.findMany({
      where,
      include: activityLogInclude,
      orderBy: [{ activityDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, userId?: string, role?: string) {
    const log = await this.prisma.activityLog.findFirst({
      where: { id, deletedAt: null },
      include: activityLogInclude,
    });
    if (!log) throw new NotFoundException('Nhật ký không tồn tại');
    this.assertAccess(log.treeBatch.garden.farm, userId, role);
    return log;
  }

  async create(dto: CreateActivityLogDto, userId?: string, role?: string) {
    const treeBatch = await this.findTreeBatch(dto.treeBatchId);

    // Validate tree_batch_id thuộc đúng garden_id nếu được truyền lên
    if (dto.gardenId && treeBatch.gardenId !== dto.gardenId) {
      throw new BadRequestException('Lô cây này không thuộc về vườn được chỉ định');
    }

    this.assertAccess(treeBatch.garden.farm, userId, role);
    this.validateHarvestFields(
      dto.activityType,
      dto.harvestQuantity,
      dto.revenue,
    );

    return this.prisma.activityLog.create({
      data: {
        treeBatchId: dto.treeBatchId,
        activityType: dto.activityType,
        activityDate: new Date(dto.activityDate),
        notes: dto.notes?.trim() || null,
        cost: dto.cost ?? null,
        harvestQuantity: dto.harvestQuantity ?? null,
        revenue: dto.revenue ?? null,
        photos: dto.photos ?? [],
        syncStatus: 'SYNCED',
      },
      include: activityLogInclude,
    });
  }

  async update(
    id: string,
    dto: UpdateActivityLogDto,
    userId?: string,
    role?: string,
  ) {
    const log = await this.findOne(id, userId, role);
    const activityType = dto.activityType || log.activityType;
    this.validateHarvestFields(activityType, dto.harvestQuantity, dto.revenue);

    return this.prisma.activityLog.update({
      where: { id },
      data: {
        ...(dto.activityType && { activityType: dto.activityType }),
        ...(dto.activityDate && { activityDate: new Date(dto.activityDate) }),
        ...(dto.notes !== undefined && { notes: dto.notes?.trim() || null }),
        ...(dto.cost !== undefined && { cost: dto.cost }),
        ...(dto.harvestQuantity !== undefined && {
          harvestQuantity: dto.harvestQuantity,
        }),
        ...(dto.revenue !== undefined && { revenue: dto.revenue }),
        ...(dto.photos !== undefined && { photos: dto.photos }),
      },
      include: activityLogInclude,
    });
  }

  async remove(id: string, userId?: string, role?: string) {
    await this.findOne(id, userId, role);
    return this.prisma.activityLog.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, deletedAt: true },
    });
  }

  private async findTreeBatch(id: string) {
    const treeBatch = await this.prisma.treeBatch.findFirst({
      where: { id, deletedAt: null },
      include: { garden: { include: { farm: true } } },
    });
    if (!treeBatch) throw new NotFoundException('Mùa vụ không tồn tại');
    if (treeBatch.garden.deletedAt || treeBatch.garden.farm.deletedAt) {
      throw new BadRequestException('Mùa vụ không còn hoạt động');
    }
    return treeBatch;
  }

  private assertAccess(farm: { userId: string }, userId?: string, role?: string) {
    if (userId && role !== 'ADMIN' && farm.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập nhật ký này');
    }
  }

  private validateHarvestFields(
    activityType: string,
    harvestQuantity?: number,
    revenue?: number,
  ) {
    if (activityType === 'HARVEST') return;
    if (harvestQuantity !== undefined || revenue !== undefined) {
      throw new BadRequestException(
        'Sản lượng và doanh thu chỉ dùng cho hoạt động thu hoạch',
      );
    }
  }

  private endOfDay(value: string) {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
  }
}
