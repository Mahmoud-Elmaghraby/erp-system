import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, ParseUUIDPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dtos/update-profile.dto';
import { PaginationDto } from '../../shared/common/dto/pagination.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ===== My Profile =====
  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  getProfile(
    @CurrentUser('id') userId: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.usersService.getProfile(userId, companyId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my profile' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, companyId, dto);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change my password' })
  changePassword(
    @CurrentUser('id') userId: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, companyId, dto);
  }

  // ===== Users Management =====
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.usersService.findAll(companyId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.usersService.findOne(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(companyId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, companyId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate user' })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.usersService.deactivate(id, companyId);
  }
}