import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './auth/auth.module';
import { FarmsModule } from './farms/farms.module';
<<<<<<< HEAD
import { JournalModule } from './journal/journal.module';

@Module({
  imports: [PrismaModule, UsersModule, CatalogModule, AuthModule, FarmsModule, JournalModule],
=======

@Module({
  imports: [PrismaModule, UsersModule, CatalogModule, AuthModule, FarmsModule],
>>>>>>> fb6e420acaae695d73323662c61acca5e014fb68
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
