import type { UserRole } from '@common/enum/user-role.enum';
import { CustomDecorator } from '@nestjs/common';
export declare const Roles: (...roles: UserRole[]) => CustomDecorator<string>;
