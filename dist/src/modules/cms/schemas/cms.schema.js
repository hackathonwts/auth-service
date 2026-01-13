"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsSchema = exports.Cms = void 0;
const status_enum_1 = require("../../../common/enum/status.enum");
const mongoose_1 = require("@nestjs/mongoose");
let Cms = class Cms {
};
exports.Cms = Cms;
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '', index: true }),
    __metadata("design:type", String)
], Cms.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '', index: true }),
    __metadata("design:type", String)
], Cms.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Cms.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'Active', enum: status_enum_1.StatusEnum, index: true }),
    __metadata("design:type", String)
], Cms.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], Cms.prototype, "isDeleted", void 0);
exports.Cms = Cms = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false })
], Cms);
exports.CmsSchema = mongoose_1.SchemaFactory.createForClass(Cms);
