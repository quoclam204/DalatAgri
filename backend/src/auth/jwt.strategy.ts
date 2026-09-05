import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-this-development-secret',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    // Thông tin này sẽ được gắn vào req.user ở mọi route được bảo vệ
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
