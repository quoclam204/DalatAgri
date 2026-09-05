import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lấy tất cả nông hộ của user đang đăng nhập (hoặc mà họ được phân công) */
  async findMyFarms(userId: string, role: string) {
    if (role === UserRole.ADMIN) {
      return this.findAll();
    }
    
    // Nếu là WORKER, lấy các farm có garden mà họ được gán
    if (role === UserRole.WORKER) {
       const assignments = await this.prisma.userGardenAssignment.findMany({
         where: { userId },
         include: { garden: { include: { farm: true } } }
       });
       // Lọc ra các farm unique
       const farms = assignments.map(a => a.garden.farm);
       const uniqueFarms = Array.from(new Set(farms.map(f => f.id))).map(id => farms.find(f => f.id === id));
       return uniqueFarms;
    }

    // Nếu là OWNER/MANAGER
    return this.prisma.farm.findMany({
      where: { userId, deletedAt: null },
      include: {
        gardens: {
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
        gardens: {
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
        gardens: { where: { deletedAt: null } },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    
    if (role !== UserRole.ADMIN && farm.userId !== userId) {
      if (role === UserRole.WORKER) {
        // Kiểm tra xem có được gán vào vườn nào của farm này không
        const assignments = await this.prisma.userGardenAssignment.findFirst({
          where: { userId, garden: { farmId: id } }
        });
        if (!assignments) throw new ForbiddenException('Bạn không có quyền xem nông hộ này');
      } else {
        throw new ForbiddenException('Bạn không có quyền xem nông hộ này');
      }
    }
    return farm;
  }

  /** Cập nhật nông hộ */
  async update(id: string, dto: UpdateFarmDto, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({ where: { id, deletedAt: null } });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    
    if (role !== UserRole.ADMIN && role !== UserRole.MANAGER && farm.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa nông hộ này');
    }
    return this.prisma.farm.update({ where: { id }, data: dto });
  }

  /** Xóa mềm nông hộ */
  async remove(id: string, userId: string, role: string) {
    const farm = await this.prisma.farm.findFirst({ where: { id, deletedAt: null } });
    if (!farm) throw new NotFoundException('Nông hộ không tồn tại');
    if (farm.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa nông hộ này');
    }
    return this.prisma.farm.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, name: true },
    });
  }
}
