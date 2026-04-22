import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TokenBlacklistService } from '../../infrastructure/redis/token-blacklist.service';
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
    user: {
      id: user.id,
      email: user.email,
      companyId: user.companyId,
      branchId: user.branchId,
    },
  };
}


async getMe(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      companyId: true,
      branchId: true,
      isActive: true,
      createdAt: true,
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) throw new UnauthorizedException('User not found');

  const permissions = user.userRoles.flatMap(ur =>
    ur.role.rolePermissions.map(rp => rp.permission.name)
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    companyId: user.companyId,
    branchId: user.branchId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    roles: user.userRoles.map(ur => ur.role.name),
    permissions: [...new Set(permissions)],
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