import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailService } from './infrastructure/mail.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change-this-development-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService],
  exports: [JwtModule],
})
export class AuthModule {}
