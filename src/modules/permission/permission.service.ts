import { BadRequestException, Body, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from '@common/types/api-response.type';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionListingDto, SavePermissionDto } from './dto/permission.dto';
import { Messages } from '@common/constants/messages';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getAll(@Body() body: PermissionListingDto): Promise<ApiResponse> {
    const permissions = await this.permissionRepository.getAllPaginate(body);
    return { success: true, message: 'Permissions fetched successfully.', data: permissions };
  }

  async save(body: SavePermissionDto): Promise<ApiResponse> {
    const moduleKey = body.module.trim().toLowerCase().replace(/\s+/g, '_');
    const actionKey = body.action.trim().toLowerCase();

    // Auto-generate permission key
    const key = `${moduleKey}.${actionKey}`;

    const existingPermission = await this.permissionRepository.getByField({
      key,
    });

    if (existingPermission) throw new ConflictException('This permission already exists!');

    const savePermission = await this.permissionRepository.save({ ...body, key });
    if (!savePermission) throw new BadRequestException(savePermission);

    return { success: true, message: 'permission saved successfully.' };
  }

  async get(id: string): Promise<ApiResponse> {
    const permission = await this.permissionRepository.getById(id);
    if (!permission) throw new NotFoundException('Permission not found!');

    return { success: true, message: 'permission retrieved successfully.', data: permission };
  }

  async delete(id: string): Promise<ApiResponse> {
    const permissionData = await this.permissionRepository.getById(id);
    if (!permissionData) throw new BadRequestException('Permission not found!');

    const delData = await this.permissionRepository.delete(id);
    if (!delData) throw new BadRequestException(delData instanceof Error ? delData : Messages.SOMETHING_WENT_WRONG);

    return { success: true, message: 'permission deleted successfully.' };
  }
}
