import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import module DB
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'change-this-development-secret',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
