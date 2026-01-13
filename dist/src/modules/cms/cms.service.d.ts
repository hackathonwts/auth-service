import { ApiResponse } from '@common/types/api-response.type';
import { CmsListingDto, StatusCmsDto, UpdateCmsDto } from '@modules/cms/dto/cms.dto';
import { CmsRepository } from '@modules/cms/repositories/cms.repository';
export declare class CmsService {
    private readonly cmsRepository;
    constructor(cmsRepository: CmsRepository);
    getAll(body: CmsListingDto): Promise<ApiResponse>;
    get(id: string): Promise<ApiResponse>;
    update(id: string, body: UpdateCmsDto): Promise<ApiResponse>;
    statusUpdate(id: string, body: StatusCmsDto): Promise<ApiResponse>;
}
