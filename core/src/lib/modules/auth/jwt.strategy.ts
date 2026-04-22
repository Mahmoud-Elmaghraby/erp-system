import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenBlacklistService } from '../../infrastructure/redis/token-blacklist.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenBlacklist: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token && await this.tokenBlacklist.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return {
      id: payload.sub,
      email: payload.email,
      companyId: payload.companyId,
      branchId: payload.branchId,
    };
  }
}