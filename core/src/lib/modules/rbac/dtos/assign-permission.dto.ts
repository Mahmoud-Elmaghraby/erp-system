import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  permissionId!: string;
}

export class AssignRoleDto {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  roleId!: string;
}