import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lấy tất cả nông hộ của user đang đăng nhập */
  async findMyFarms(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId, deletedAt: null },
      include: {
        plots: {
          where: { deletedAt: null },
          select: { id: true, name: true, area: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Lấy tất cả nông hộ (chỉ ADMIN) */
  async findAll() {
    return this.prisma.farm.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        plots: {
          where: { deletedAt: null },
          select: { id: true, name: true, area: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Tạo nông hộ mới */
  async create(userId: string, dto: CreateFarmDto) {
    return this.prisma.farm.create({
      data: { userId, ...dto },
    });
  }

  /** Xem chi tiết 1 nông hộ */
  async findOne(id: string, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({
      where: { id, deletedAt: null },
      include: {
        plots: { where: { deletedAt: null } },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xem nông hộ này');
    }
    return farm;
  }

  /** Cập nhật nông hộ */
  async update(id: string, dto: UpdateFarmDto, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({ where: { id, deletedAt: null } });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa nông hộ này');
    }
    return this.prisma.farm.update({ where: { id }, data: dto });
  }

  /** Xóa mềm nông hộ */
  async remove(id: string, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({ where: { id, deletedAt: null } });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa nông hộ này');
    }
    return this.prisma.farm.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, name: true },
    });
  }
}
