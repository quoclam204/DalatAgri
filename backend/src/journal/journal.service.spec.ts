import { BadRequestException } from '@nestjs/common';
import { JournalService } from './journal.service';

describe('JournalService', () => {
  const prisma: any = {
    farm: { findMany: jest.fn() },
    cropCycle: { findFirst: jest.fn() },
    activityLog: { findMany: jest.fn() },
    $transaction: jest.fn(async (callback) => callback({
      inventory: { findFirst: jest.fn(), update: jest.fn() },
      activityLog: { create: jest.fn().mockResolvedValue({ id: 'log-1' }), findUnique: jest.fn() },
      activityMaterial: { create: jest.fn() },
    })),
  };
  const service = new JournalService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('rejects a crop cycle belonging to another farm', async () => {
    prisma.cropCycle.findFirst.mockResolvedValue({ plot: { farmId: 'farm-b', farm: { userId: 'user-1', id: 'farm-b' } } });
    await expect(service.create('user-1', { farmId: 'farm-a', cropCycleId: 'cycle-1', date: '2026-09-05', workType: 'WATER' as any })).rejects.toThrow(BadRequestException);
  });

  it('filters history by farm, crop and date range', async () => {
    prisma.activityLog.findMany.mockResolvedValue([]);
    await service.history('user-1', { farmId: 'farm-a', cropId: 'crop-a', from: '2026-09-01', to: '2026-09-05', workType: 'FERTILIZE' as any });
    expect(prisma.activityLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ activityType: 'FERTILIZE', activityDate: { gte: new Date('2026-09-01'), lte: new Date('2026-09-05') } }) }));
  });

  it('creates one transaction for a journal with materials', async () => {
    prisma.cropCycle.findFirst.mockResolvedValue({ id: 'cycle-1', plot: { farmId: 'farm-a', farm: { userId: 'user-1', id: 'farm-a' } } });
    const result = service.create('user-1', { cropCycleId: 'cycle-1', date: '2026-09-05', workType: 'FERTILIZE' as any, materials: [{ materialId: 'mat-1', quantityUsed: 2 }] });
    await expect(result).rejects.toThrow();
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });
});
