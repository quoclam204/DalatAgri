import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import cái khiên bảo vệ

@UseGuards(JwtAuthGuard) // Gắn khiên này vào: KHÔNG CÓ TOKEN THÌ KHÔNG ĐƯỢC VÀO API
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) { }

  @Post()
  createFarm(@Request() req, @Body() body: any) {
    // Nhờ có JwtAuthGuard, hệ thống biết được ai đang gọi API thông qua req.user
    return this.farmsService.create(req.user.userId, body);
  }

  @Get()
  getMyFarms(@Request() req) {
    return this.farmsService.findMyFarms(req.user.userId);
  }
}
