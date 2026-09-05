import { Module } from '@nestjs/common';
import { FarmsService } from './application/farms.service';
import { GardensService } from './application/gardens.service';
import { FarmsController } from './infrastructure/farms.controller';
import { GardensController } from './infrastructure/gardens.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FarmsController, GardensController],
  providers: [FarmsService, GardensService],
})
export class FarmsModule {}
