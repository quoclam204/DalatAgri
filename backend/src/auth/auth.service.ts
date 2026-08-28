import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
    const user = await this.usersService.verifyCredentials(dto.email, dto.password);
    return {
      message: 'Đăng nhập thành công',
      ...this.usersService.createSession(user),
    };
  }
}
