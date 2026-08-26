import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  // Inject PrismaService vào để dùng
  constructor(private prisma: PrismaService) { }

  // Hàm lấy danh sách tất cả người dùng
  async findAll() {
    return this.prisma.user.findMany();
  }

  // Hàm tạo người dùng mới
  async create(data: { email: string; passwordHash: string; fullName: string; role: string }) {
    return this.prisma.user.create({
      data: data,
    });
  }
}
