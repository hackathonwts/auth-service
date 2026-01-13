import { RoleListingDto, SaveRoleDto, StatusRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleService } from './role.service';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    saveRole(dto: SaveRoleDto): Promise<import("../../common/types/api-response.type").ApiResponse>;
    getRole(id: string): Promise<import("../../common/types/api-response.type").ApiResponse>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<import("../../common/types/api-response.type").ApiResponse>;
    statusChange(id: string, dto: StatusRoleDto): Promise<import("../../common/types/api-response.type").ApiResponse>;
    deleteRole(id: string): Promise<import("../../common/types/api-response.type").ApiResponse>;
    getAllRole(dto: RoleListingDto): Promise<import("../../common/types/api-response.type").ApiResponse>;
}
