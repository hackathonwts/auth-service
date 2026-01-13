"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepositoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const role_schema_1 = require("../schemas/role.schema");
const role_repository_1 = require("./role.repository");
let RoleRepositoryModule = class RoleRepositoryModule {
};
exports.RoleRepositoryModule = RoleRepositoryModule;
exports.RoleRepositoryModule = RoleRepositoryModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: role_schema_1.Role.name,
                    useFactory: () => {
                        const schema = role_schema_1.RoleSchema;
                        return schema;
                    },
                },
            ])
        ],
        controllers: [],
        providers: [role_repository_1.RoleRepository],
        exports: [role_repository_1.RoleRepository]
    })
], RoleRepositoryModule);
