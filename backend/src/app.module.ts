import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module'; //
<<<<<<< HEAD
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [PrismaModule, UsersModule, CatalogModule],
=======
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule], // 2. Thêm vào đây
>>>>>>> origin/main
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
