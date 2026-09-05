import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from '../application/dto/register.dto';
import { LoginDto } from '../application/dto/login.dto';
import { ForgotPasswordDto } from '../application/dto/forgot-password.dto';
import { ResetPasswordDto } from '../application/dto/reset-password.dto';
import { GoogleLoginDto } from '../application/dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/register - Đăng ký tài khoản */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** POST /auth/login - Đăng nhập */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** POST /auth/google - Đăng nhập bằng Google */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
  }

  /** POST /auth/google/access-token - Đăng nhập bằng Google OAuth token */
  @Post('google/access-token')
  @HttpCode(HttpStatus.OK)
  googleAccessTokenLogin(@Body('accessToken') accessToken: string) {
    if (!accessToken) {
      throw new BadRequestException('Google access token không được để trống');
    }
    return this.authService.googleAccessTokenLogin(accessToken);
  }

  /** POST /auth/forgot-password - Quên mật khẩu */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  /** POST /auth/reset-password - Đặt lại mật khẩu */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
