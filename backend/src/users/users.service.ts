import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    // Lấy user nhưng không trả về passwordHash cho an toàn
    return this.prisma.user.findMany({
      select: { id: true, email: true, fullName: true, role: true }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; passwordHash: string; fullName: string; role: string }) {
    return this.prisma.user.create({ data });
  }
}
