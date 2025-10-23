import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';

import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/config/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().jwt.secret || 'secretKey',
    });
  }

  async validate(payload: User) {
    const user = await this.userService.findById(payload.id, false);
    if (!user) {
      return null;
    }
    return user;
  }
}
