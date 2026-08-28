import { Module } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule], // Nhớ import cái này để gọi được DB
    controllers: [FarmsController],
    providers: [FarmsService],
})
export class FarmsModule { }
