import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@nestjs/swagger', () => ({
  ApiProperty: jest.fn(() => () => {}),
  ApiPropertyOptional: jest.fn(() => () => {}),
}));

import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';

describe('ActivityLogsController', () => {
  let controller: ActivityLogsController;
  let service: any;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogsController],
      providers: [
        {
          provide: ActivityLogsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ActivityLogsController>(ActivityLogsController);
    service = module.get<ActivityLogsService>(ActivityLogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', () => {
    const req = { user: { userId: '1', role: 'OWNER' } };
    controller.findAll(req, {});
    expect(service.findAll).toHaveBeenCalledWith('1', 'OWNER', {});
  });

  it('should call create', () => {
    const req = { user: { userId: '1', role: 'OWNER' } };
    const dto = { treeBatchId: '1', activityType: 'WATERING', activityDate: '2023-01-01' };
    controller.create(dto, req);
    expect(service.create).toHaveBeenCalledWith(dto, '1', 'OWNER');
  });
});
