import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import type { CurrentUserPayload } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get access token' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.getMe(user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate token' })
  async logout(@Req() req: Request) {
    const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
    return this.authService.logout(token);
  }
}