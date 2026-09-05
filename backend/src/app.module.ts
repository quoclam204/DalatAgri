import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './auth/auth.module';
import { FarmsModule } from './farms/farms.module';
import { JournalModule } from './journal/journal.module';

@Module({
  imports: [PrismaModule, UsersModule, CatalogModule, AuthModule, FarmsModule, JournalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
