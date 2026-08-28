import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Cần UsersModule để lấy UsersService
    JwtModule.register({
      secret: 'MY_SECRET_KEY', // Nên dùng biến môi trường (chúng ta sẽ sửa sau)
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Đăng ký JwtStrategy vào providers
})
export class AuthModule { }
