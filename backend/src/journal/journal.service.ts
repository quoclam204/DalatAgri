import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJournalDto, JournalHistoryQueryDto, JournalOptionsQueryDto } from './dto/create-journal.dto';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  private async ownedCycle(userId: string, farmId: string | undefined, plotId: string | undefined, cropCycleId: string | undefined) {
    const cycle = await this.prisma.cropCycle.findFirst({ where: { ...(cropCycleId ? { id: cropCycleId } : {}), ...(plotId ? { plotId } : {}), deletedAt: null }, include: { plot: { include: { farm: true } }, crop: true } });
    if (!cycle || cycle.plot.farm.userId !== userId || (farmId && cycle.plot.farmId !== farmId)) throw new BadRequestException('Lô cây không thuộc vườn đã chọn');
    return cycle;
  }

  async options(userId: string, query: JournalOptionsQueryDto) {
    const farms = await this.prisma.farm.findMany({ where: { userId, deletedAt: null, ...(query.farmId ? { id: query.farmId } : {}) }, include: { plots: { where: { deletedAt: null }, include: { cropCycles: { where: { deletedAt: null, status: { not: 'COMPLETED' } }, include: { crop: true } } } } }, orderBy: { name: 'asc' } });
    return { farms, autoSelect: farms.length === 1 && farms[0].plots.length === 1 && farms[0].plots[0].cropCycles.length === 1 ? { farmId: farms[0].id, plotId: farms[0].plots[0].id, cropCycleId: farms[0].plots[0].cropCycles[0].id } : null };
  }

  async create(userId: string, dto: CreateJournalDto) {
    const cycle = await this.ownedCycle(userId, dto.farmId, dto.plotId, dto.cropCycleId);
    const materials = dto.materials ?? [];
    return this.prisma.$transaction(async (tx) => {
      const inventoryRows: Array<{ inventory: any; item: { materialId: string; quantityUsed: number } }> = [];
      for (const item of materials) {
        const inventory = await tx.inventory.findFirst({ where: { farmId: cycle.plot.farmId, materialId: item.materialId, deletedAt: null }, include: { material: true } });
        if (!inventory) throw new BadRequestException('Vật tư không có trong kho của vườn');
        if (inventory.quantity < item.quantityUsed) throw new BadRequestException(`Không đủ tồn kho: ${inventory.material.name}`);
        inventoryRows.push({ inventory, item });
      }
      const log = await tx.activityLog.create({ data: { cropCycleId: cycle.id, activityType: dto.workType, activityDate: new Date(dto.date), notes: dto.description, photos: dto.photos ?? [], syncStatus: 'SYNCED' } });
      for (const { inventory, item } of inventoryRows) await tx.activityMaterial.create({ data: { activityLogId: log.id, materialId: item.materialId, quantityUsed: item.quantityUsed, cost: item.quantityUsed * inventory.material.defaultPrice } });
      for (const { inventory, item } of inventoryRows) await tx.inventory.update({ where: { id: inventory.id }, data: { quantity: { decrement: item.quantityUsed }, totalCost: { decrement: item.quantityUsed * inventory.material.defaultPrice } } });
      return tx.activityLog.findUnique({ where: { id: log.id }, include: { materials: { include: { material: true } }, cropCycle: { include: { plot: true, crop: true } } } });
    });
  }

  async history(userId: string, query: JournalHistoryQueryDto) {
    return this.prisma.activityLog.findMany({ where: { deletedAt: null, activityType: query.workType, ...(query.cropCycleId ? { cropCycleId: query.cropCycleId } : {}), activityDate: { ...(query.from ? { gte: new Date(query.from) } : {}), ...(query.to ? { lte: new Date(query.to) } : {}) }, cropCycle: { plot: { farm: { userId, ...(query.farmId ? { id: query.farmId } : {}) } }, ...(query.cropId ? { cropId: query.cropId } : {}) } }, include: { materials: { include: { material: true } }, cropCycle: { include: { plot: true, crop: true } } }, orderBy: { activityDate: 'desc' } });
  }
}
