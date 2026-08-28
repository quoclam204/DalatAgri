import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async register(data: any) {
        // 1. Kiểm tra email đã tồn tại chưa
        const existingUser = await this.usersService.findByEmail(data.email);
        if (existingUser) throw new BadRequestException('Email đã được sử dụng!');

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // 3. Tạo user vào DB
        const newUser = await this.usersService.create({
            email: data.email,
            passwordHash: hashedPassword,
            fullName: data.fullName,
            role: data.role || 'OWNER',
        });

        // 4. Sinh JWT Token
        const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };
        return {
            message: 'Đăng ký thành công',
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(data: any) {
        // 1. Kiểm tra user có tồn tại
        const user = await this.usersService.findByEmail(data.email);
        if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');

        // 2. Kiểm tra mật khẩu (so khớp mã băm)
        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');

        // 3. Trả về Token
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            message: 'Đăng nhập thành công',
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, fullName: user.fullName, role: user.role }
        };
    }
}
