import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
<<<<<<< HEAD
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
=======
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
>>>>>>> origin/main
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService], // QUAN TRỌNG: Thêm dòng này
})
export class UsersModule { }
