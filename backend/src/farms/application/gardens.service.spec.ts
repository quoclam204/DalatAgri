import { Test, TestingModule } from '@nestjs/testing';
import { GardensService } from './gardens.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('GardensService', () => {
  let service: GardensService;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      farm: { findFirst: jest.fn() },
      garden: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      treeBatch: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      userGardenAssignment: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GardensService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<GardensService>(GardensService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Role-based Access Control', () => {
    it('WORKER cannot create a garden', async () => {
      prisma.farm.findFirst.mockResolvedValue({ id: 'farm1', userId: 'owner1' });
      const dto = { name: 'Vườn A', area: 10 };
      await expect(service.createGarden('farm1', 'worker1', UserRole.WORKER, dto))
        .rejects.toThrow(ForbiddenException);
    });

    it('WORKER can view assigned garden', async () => {
      const mockGarden = { id: 'garden1', farmId: 'farm1', farm: { userId: 'owner1' } };
      prisma.garden.findFirst.mockResolvedValue(mockGarden);
      prisma.userGardenAssignment.findFirst.mockResolvedValue({ userId: 'worker1', gardenId: 'garden1' });

      const result = await service.findOneGarden('farm1', 'garden1', 'worker1', UserRole.WORKER);
      expect(result).toEqual(mockGarden);
    });

    it('WORKER cannot view unassigned garden', async () => {
      const mockGarden = { id: 'garden1', farmId: 'farm1', farm: { userId: 'owner1' } };
      prisma.garden.findFirst.mockResolvedValue(mockGarden);
      prisma.userGardenAssignment.findFirst.mockResolvedValue(null);

      await expect(service.findOneGarden('farm1', 'garden1', 'worker1', UserRole.WORKER))
        .rejects.toThrow(ForbiddenException);
    });

    it('OWNER can update their own garden', async () => {
      const mockGarden = { id: 'garden1', farmId: 'farm1', farm: { userId: 'owner1' } };
      prisma.garden.findFirst.mockResolvedValue(mockGarden);
      prisma.garden.update.mockResolvedValue({ ...mockGarden, name: 'Vườn mới' });

      const result = await service.updateGarden('farm1', 'garden1', 'owner1', UserRole.OWNER, { name: 'Vườn mới' });
      expect(result.name).toBe('Vườn mới');
    });
  });

  describe('Xen Canh - 1 Vườn trồng Cà phê và Sầu riêng', () => {
    it('should retrieve multiple distinct tree batches with different crop types', async () => {
      // Giả lập quyền truy cập thành công
      prisma.garden.findFirst.mockResolvedValue({
        id: 'garden1', farmId: 'farm1', farm: { userId: 'owner1' }
      });

      // Trả về 2 lô cây thuộc 2 loại khác nhau
      const mockBatches = [
        { id: 'batch_cf', gardenId: 'garden1', cropType: { name: 'Cà Phê' } },
        { id: 'batch_sr', gardenId: 'garden1', cropType: { name: 'Sầu Riêng' } },
      ];
      prisma.treeBatch.findMany.mockResolvedValue(mockBatches);

      const result = await service.findTreeBatches('farm1', 'garden1', 'owner1', UserRole.OWNER);

      expect(prisma.treeBatch.findMany).toHaveBeenCalledWith({
        where: { gardenId: 'garden1', deletedAt: null },
        include: { cropType: true },
        orderBy: { createdAt: 'desc' },
      });
      
      expect(result.length).toBe(2);
      expect(result[0].cropType.name).toBe('Cà Phê');
      expect(result[1].cropType.name).toBe('Sầu Riêng');
      // Dữ liệu độc lập
      expect(result[0].id).not.toBe(result[1].id);
    });
  });
});
