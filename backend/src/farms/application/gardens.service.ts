import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGardenDto, UpdateGardenDto } from './dto/garden.dto';
import { CreateTreeBatchDto, UpdateTreeBatchDto } from './dto/tree-batch.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class GardensService {
  constructor(private readonly prisma: PrismaService) {}

  /** KHOẢNG GARDEN ============================= */

  private async checkFarmAccess(farmId: string, userId: string, role: string, isWrite: boolean) {
    const farm = await this.prisma.farm.findFirst({
      where: { id: farmId, deletedAt: null },
    });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');

    if (role === UserRole.ADMIN) return farm;

    if (farm.userId !== userId) {
      if (isWrite || role === UserRole.WORKER) {
        throw new ForbiddenException('Bạn không có quyền thao tác trên nông hộ này');
      }
    }
    return farm;
  }

  private async checkGardenAccess(farmId: string, gardenId: string, userId: string, role: string, isWrite: boolean) {
    const garden = await this.prisma.garden.findFirst({
      where: { id: gardenId, farmId, deletedAt: null },
      include: { farm: true }
    });
    if (!garden) throw new NotFoundException('Vườn không tồn tại');

    if (role === UserRole.ADMIN) return garden;

    if (garden.farm.userId === userId) {
      // is OWNER or MANAGER of this farm
      return garden;
    }

    if (role === UserRole.WORKER && !isWrite) {
      // Check assignment
      const assign = await this.prisma.userGardenAssignment.findFirst({
        where: { userId, gardenId }
      });
      if (!assign) throw new ForbiddenException('Bạn không được phân công vào vườn này');
      return garden;
    }

    throw new ForbiddenException('Bạn không có quyền thao tác trên vườn này');
  }

  async createGarden(farmId: string, userId: string, role: string, dto: CreateGardenDto) {
    await this.checkFarmAccess(farmId, userId, role, true);
    return this.prisma.garden.create({
      data: {
        farmId,
        ...dto,
      },
    });
  }

  async findGardens(farmId: string, userId: string, role: string) {
    // If worker, only show assigned gardens
    if (role === UserRole.WORKER) {
      const assigns = await this.prisma.userGardenAssignment.findMany({
        where: { userId, garden: { farmId, deletedAt: null } },
        include: { garden: true }
      });
      return assigns.map(a => a.garden);
    }
    
    // Check farm access (for Owner/Admin)
    await this.checkFarmAccess(farmId, userId, role, false);
    return this.prisma.garden.findMany({
      where: { farmId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneGarden(farmId: string, gardenId: string, userId: string, role: string) {
    const garden = await this.checkGardenAccess(farmId, gardenId, userId, role, false);
    return garden;
  }

  async updateGarden(farmId: string, gardenId: string, userId: string, role: string, dto: UpdateGardenDto) {
    await this.checkGardenAccess(farmId, gardenId, userId, role, true);
    return this.prisma.garden.update({
      where: { id: gardenId },
      data: dto,
    });
  }

  async removeGarden(farmId: string, gardenId: string, userId: string, role: string) {
    await this.checkGardenAccess(farmId, gardenId, userId, role, true);
    return this.prisma.garden.update({
      where: { id: gardenId },
      data: { deletedAt: new Date() },
    });
  }

  /** KHOẢNG TREE BATCH ============================= */

  async createTreeBatch(farmId: string, gardenId: string, userId: string, role: string, dto: CreateTreeBatchDto) {
    await this.checkGardenAccess(farmId, gardenId, userId, role, true);
    return this.prisma.treeBatch.create({
      data: {
        gardenId,
        cropTypeId: dto.cropTypeId,
        name: dto.name,
        startDate: new Date(dto.startDate),
        expectedEndDate: new Date(dto.expectedEndDate),
        status: dto.status,
      },
    });
  }

  async findTreeBatches(farmId: string, gardenId: string, userId: string, role: string) {
    await this.checkGardenAccess(farmId, gardenId, userId, role, false);
    return this.prisma.treeBatch.findMany({
      where: { gardenId, deletedAt: null },
      include: { cropType: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
