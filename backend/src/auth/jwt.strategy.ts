import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'MY_SECRET_KEY', // Chìa khóa bí mật (Thực tế nên để ở file .env)
        });
    }

    async validate(payload: any) {
        // Trả về thông tin user đã giải mã từ Token. Biến này sẽ gắn vào `req.user`
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
