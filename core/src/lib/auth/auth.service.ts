import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { TokenBlacklistService } from '../redis/token-blacklist.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tokenBlacklist: TokenBlacklistService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      branchId: user.branchId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode(token) as any;
    if (decoded?.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) await this.tokenBlacklist.blacklist(token, ttl * 1000);
    }
    return { message: 'Logged out successfully' };
  }
}