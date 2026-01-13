import { CmsService } from './cms.service';
import { CmsListingDto, StatusCmsDto, UpdateCmsDto } from '@modules/cms/dto/cms.dto';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    getAllCms(dto: CmsListingDto): Promise<import("../../common/types/api-response.type").ApiResponse>;
    getCms(id: string): Promise<import("../../common/types/api-response.type").ApiResponse>;
    updateCms(id: string, dto: UpdateCmsDto): Promise<import("../../common/types/api-response.type").ApiResponse>;
    statusChange(id: string, dto: StatusCmsDto): Promise<import("../../common/types/api-response.type").ApiResponse>;
}
