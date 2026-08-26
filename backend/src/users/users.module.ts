import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import module DB

@Module({
    imports: [PrismaModule], // Khai báo dùng Prisma
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
