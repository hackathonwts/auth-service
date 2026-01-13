import { PermissionListingDto, SavePermissionDto } from '../dto/permission.dto';
import { PermissionsService } from '../permission.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    savePermission(dto: SavePermissionDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    getAll(dto: PermissionListingDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    findOne(id: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deletePermission(id: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
