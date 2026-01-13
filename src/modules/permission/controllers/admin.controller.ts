import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionListingDto, SavePermissionDto } from '../dto/permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@common/decorator/role.decorator';
import { RBAcGuard } from '@common/guards/rbac.guard';
import { UserRole } from '@common/enum/user-role.enum';
import { PermissionsService } from '../permission.service';

@ApiTags('Permissions')
@Controller('admin/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Version('1')
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create permission' })
  @HttpCode(200)
  savePermission(@Body() dto: SavePermissionDto) {
    return this.permissionsService.save(dto);
  }

  @Version('1')
  @Post('getall')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all permissions' })
  getAll(@Body() dto: PermissionListingDto) {
    return this.permissionsService.getAll(dto);
  }

  @Version('1')
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get permission by id' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.get(id);
  }

  @Version('1')
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete permission' })
  deletePermission(@Param('id') id: string) {
    return this.permissionsService.delete(id);
  }
}
