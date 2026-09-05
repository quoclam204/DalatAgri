import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './auth/auth.module';
import { FarmsModule } from './farms/farms.module';

@Module({
  imports: [PrismaModule, UsersModule, CatalogModule, AuthModule, FarmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
