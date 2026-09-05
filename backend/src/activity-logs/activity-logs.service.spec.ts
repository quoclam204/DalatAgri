import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsService } from './activity-logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ActivityLogsService', () => {
  let service: ActivityLogsService;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      activityLog: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      treeBatch: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ActivityLogsService>(ActivityLogsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of activity logs', async () => {
      const mockLogs = [{ id: '1' }];
      prisma.activityLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.findAll('user1', 'OWNER', {});
      expect(result).toEqual(mockLogs);
      expect(prisma.activityLog.findMany).toHaveBeenCalled();
    });

    it('should filter by gardenId and cropTypeId', async () => {
      prisma.activityLog.findMany.mockResolvedValue([]);
      await service.findAll('user1', 'OWNER', { gardenId: 'g1', cropTypeId: 'c1' });
      
      expect(prisma.activityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            treeBatch: expect.objectContaining({
              gardenId: 'g1',
              cropTypeId: 'c1',
            }),
          }),
        })
      );
    });
  });

  describe('create', () => {
    it('should throw NotFoundException if treeBatch not found', async () => {
      prisma.treeBatch.findFirst.mockResolvedValue(null);
      const dto = { treeBatchId: '1', activityType: 'WATERING', activityDate: '2023-01-01' };
      await expect(service.create(dto, 'user1', 'OWNER')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if treeBatch does not belong to gardenId', async () => {
      prisma.treeBatch.findFirst.mockResolvedValue({
        gardenId: 'garden2',
        garden: { farm: { userId: 'user1' } },
      });
      const dto = { treeBatchId: '1', gardenId: 'garden1', activityType: 'WATERING', activityDate: '2023-01-01' };
      await expect(service.create(dto, 'user1', 'OWNER')).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if user has no access', async () => {
      prisma.treeBatch.findFirst.mockResolvedValue({
        garden: { farm: { userId: 'user2' } }, // different user
      });
      const dto = { treeBatchId: '1', activityType: 'WATERING', activityDate: '2023-01-01' };
      await expect(service.create(dto, 'user1', 'WORKER')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if harvestQuantity is set for non-HARVEST type', async () => {
      prisma.treeBatch.findFirst.mockResolvedValue({
        garden: { farm: { userId: 'user1' } },
      });
      const dto = { treeBatchId: '1', activityType: 'WATERING', activityDate: '2023-01-01', harvestQuantity: 10 };
      await expect(service.create(dto, 'user1', 'OWNER')).rejects.toThrow(BadRequestException);
    });

    it('should create an activity log with photos', async () => {
      prisma.treeBatch.findFirst.mockResolvedValue({
        garden: { farm: { userId: 'user1' } },
      });
      const createdLog = { id: '1', photos: ['url1'] };
      prisma.activityLog.create.mockResolvedValue(createdLog);

      const dto = { treeBatchId: '1', activityType: 'WATERING', activityDate: '2023-01-01', photos: ['url1'] };
      const result = await service.create(dto, 'user1', 'OWNER');
      expect(result).toEqual(createdLog);
      expect(prisma.activityLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ photos: ['url1'] }),
        include: expect.any(Object),
      });
    });
  });
});
