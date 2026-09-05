import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../../users/users.service';
import { MailService } from '../infrastructure/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /** Đăng ký tài khoản mới */
  async register(dto: RegisterDto) {
    const newUser = await this.usersService.create(dto);
    return {
      message: 'Đăng ký thành công',
      ...this.usersService.createSession(newUser),
    };
  }

  /** Đăng nhập */
  async login(dto: LoginDto) {
    const user = await this.usersService.verifyCredentials(
      dto.email,
      dto.password,
    );
    return {
      message: 'Đăng nhập thành công',
      ...this.usersService.createSession(user),
    };
  }

  /** Đăng nhập bằng Google */
  async googleLogin(dto: GoogleLoginDto) {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim().replace(
      /^['"]|['"]$/g,
      '',
    );
    if (!clientId) {
      throw new BadRequestException('Chưa cấu hình GOOGLE_CLIENT_ID');
    }

    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: dto.credential,
        audience: clientId,
      });
    } catch {
      throw new UnauthorizedException(
        'Google credential không hợp lệ hoặc không khớp GOOGLE_CLIENT_ID',
      );
    }
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Google credential không hợp lệ');
    }

    const user = await this.usersService.upsertGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      fullName: payload.name || payload.email.split('@')[0],
    });

    return {
      message: 'Đăng nhập Google thành công',
      ...this.usersService.createSession(user),
    };
  }

  /** Đăng nhập Google bằng OAuth access token từ Token Client */
  async googleAccessTokenLogin(accessToken: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim().replace(
      /^['"]|['"]$/g,
      '',
    );
    if (!clientId) {
      throw new BadRequestException('Chưa cấu hình GOOGLE_CLIENT_ID');
    }

    let tokenInfoResponse: Response;
    try {
      tokenInfoResponse = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
      );
    } catch {
      throw new UnauthorizedException('Không thể kết nối dịch vụ Google');
    }

    if (!tokenInfoResponse.ok) {
      throw new UnauthorizedException('Google access token không hợp lệ');
    }

    const tokenInfo = (await tokenInfoResponse.json()) as { aud?: string };
    if (tokenInfo.aud !== clientId) {
      throw new UnauthorizedException(
        'Google access token không khớp GOOGLE_CLIENT_ID',
      );
    }

    let profileResponse: Response;
    try {
      profileResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch {
      throw new UnauthorizedException('Không thể kết nối dịch vụ Google');
    }
    if (!profileResponse.ok) {
      throw new UnauthorizedException(
        'Không thể lấy thông tin tài khoản Google',
      );
    }

    const profile = (await profileResponse.json()) as {
      sub?: string;
      email?: string;
      name?: string;
      email_verified?: boolean;
    };
    if (!profile.sub || !profile.email || profile.email_verified === false) {
      throw new UnauthorizedException('Tài khoản Google chưa xác minh email');
    }

    const user = await this.usersService.upsertGoogleUser({
      googleId: profile.sub,
      email: profile.email,
      fullName: profile.name || profile.email.split('@')[0],
    });

    return {
      message: 'Đăng nhập Google thành công',
      ...this.usersService.createSession(user),
    };
  }

  /** Quên mật khẩu */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      // Để bảo mật, luôn trả về thông báo chung chung dù email không tồn tại
      return {
        message: 'Nếu email hợp lệ, chúng tôi đã gửi link đặt lại mật khẩu.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15); // Hết hạn sau 15 phút

    await this.usersService.saveResetToken(user.id, resetToken, expires);
    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Nếu email hợp lệ, chúng tôi đã gửi link đặt lại mật khẩu.',
    };
  }

  /** Đặt lại mật khẩu */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(dto.token);
    if (!user) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn.');
    }

    const newPasswordHash = await this.usersService.hashPassword(
      dto.newPassword,
    );
    await this.usersService.resetPassword(user.id, newPasswordHash);

    return { message: 'Mật khẩu đã được thay đổi thành công.' };
  }
}
