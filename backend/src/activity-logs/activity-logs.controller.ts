import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import {
  ActivityLogQueryDto,
  CreateActivityLogDto,
  UpdateActivityLogDto,
} from './dto/activity-log.dto';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findAll(@Request() req: any, @Query() query: ActivityLogQueryDto) {
    return this.activityLogsService.findAll(
      req.user?.userId,
      req.user?.role,
      query,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.activityLogsService.findOne(id, req.user?.userId, req.user?.role);
  }

  @Post()
  create(@Body() dto: CreateActivityLogDto, @Request() req: any) {
    return this.activityLogsService.create(dto, req.user?.userId, req.user?.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActivityLogDto,
    @Request() req: any,
  ) {
    return this.activityLogsService.update(
      id,
      dto,
      req.user?.userId,
      req.user?.role,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.activityLogsService.remove(id, req.user?.userId, req.user?.role);
  }
}
