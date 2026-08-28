import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(nodeScrypt);

type AccountInput = {
  email: string;
  password: string;
  fullName: string;
  role?: string;
};

@Injectable()
export class UsersService {
<<<<<<< HEAD
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async register(input: AccountInput) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const passwordHash = await this.hashPassword(input.password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: input.fullName.trim(),
        role: input.role || 'FARMER',
      },
    });

    return this.createSession(user);
  }

  async login(emailInput: string, password: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    return this.createSession(user);
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(password: string, storedHash: string) {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    const storedKey = Buffer.from(key, 'hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
  }

  private async createSession(user: { id: string; email: string; fullName: string; role: string }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
=======
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
>>>>>>> origin/main
  }
}
