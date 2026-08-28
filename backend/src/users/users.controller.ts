import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET /users - Danh sách tất cả người dùng (chỉ ADMIN) */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  /** GET /users/me - Thông tin cá nhân đang đăng nhập */
  @Get('me')
  getMe(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  /** PATCH /users/me - Cập nhật thông tin cá nhân */
  @Patch('me')
  updateMe(@Request() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  /** GET /users/:id - Thông tin 1 người dùng (ADMIN) */
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /** PATCH /users/:id/role - Thay đổi vai trò (ADMIN) */
  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @Request() req: any,
  ) {
    return this.usersService.updateRole(id, dto, req.user.userId);
  }

  /** PATCH /users/:id/toggle-active - Kích hoạt/vô hiệu hóa (ADMIN) */
  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  toggleActive(@Param('id') id: string, @Request() req: any) {
    return this.usersService.toggleActive(id, req.user.userId);
  }

  /** DELETE /users/:id - Xóa mềm người dùng (ADMIN) */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.usersService.softDelete(id, req.user.userId);
  }
}
