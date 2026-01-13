import { ApiResponse } from '@common/types/api-response.type';
import { RoleRepository } from './repositories/role.repository';
import { RoleListingDto, SaveRoleDto, StatusRoleDto, UpdateRoleDto } from './dto/role.dto';
export declare class RoleService {
    private readonly roleRepository;
    constructor(roleRepository: RoleRepository);
    getAll(body: RoleListingDto): Promise<ApiResponse>;
    save(body: SaveRoleDto): Promise<ApiResponse>;
    get(id: string): Promise<ApiResponse>;
    update(id: string, body: UpdateRoleDto): Promise<ApiResponse>;
    delete(id: string): Promise<ApiResponse>;
    statusUpdate(id: string, body: StatusRoleDto): Promise<ApiResponse>;
}
