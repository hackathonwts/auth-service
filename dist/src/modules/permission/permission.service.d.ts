import { ApiResponse } from '@common/types/api-response.type';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionListingDto, SavePermissionDto } from './dto/permission.dto';
export declare class PermissionsService {
    private readonly permissionRepository;
    constructor(permissionRepository: PermissionRepository);
    getAll(body: PermissionListingDto): Promise<ApiResponse>;
    save(body: SavePermissionDto): Promise<ApiResponse>;
    get(id: string): Promise<ApiResponse>;
    delete(id: string): Promise<ApiResponse>;
}
