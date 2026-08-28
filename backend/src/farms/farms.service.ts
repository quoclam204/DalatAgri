import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, data: { name: string; location: string; totalArea: number }) {
    return this.prisma.farm.create({
      data: {
        ...data,
        userId: userId, // Gắn ID của người nông dân đang đăng nhập vào Nông hộ
      },
    });
  }

  async findMyFarms(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId },
    });
  }
}
