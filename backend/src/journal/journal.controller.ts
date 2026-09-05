import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/infrastructure/jwt-auth.guard';
import { JournalService } from './journal.service';
import { CreateJournalDto, JournalHistoryQueryDto, JournalOptionsQueryDto } from './dto/create-journal.dto';

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly service: JournalService) {}
  @Get('options') options(@Request() req: any, @Query() query: JournalOptionsQueryDto) { return this.service.options(req.user.userId, query); }
  @Get() history(@Request() req: any, @Query() query: JournalHistoryQueryDto) { return this.service.history(req.user.userId, query); }
  @Post() create(@Request() req: any, @Body() dto: CreateJournalDto) { return this.service.create(req.user.userId, dto); }
}
