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
exports.UserDeviceSchema = exports.UserDevice = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_role_enum_1 = require("../../../common/enum/user-role.enum");
let AdditionalDetails = class AdditionalDetails {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], AdditionalDetails.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], AdditionalDetails.prototype, "version", void 0);
AdditionalDetails = __decorate([
    (0, mongoose_1.Schema)({ timestamps: false, versionKey: false })
], AdditionalDetails);
let BrowserInfo = class BrowserInfo extends AdditionalDetails {
};
BrowserInfo = __decorate([
    (0, mongoose_1.Schema)({ timestamps: false, versionKey: false })
], BrowserInfo);
let OperatingSystemInfo = class OperatingSystemInfo extends AdditionalDetails {
};
OperatingSystemInfo = __decorate([
    (0, mongoose_1.Schema)({ timestamps: false, versionKey: false })
], OperatingSystemInfo);
let DeviceInfo = class DeviceInfo {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], DeviceInfo.prototype, "vendor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], DeviceInfo.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], DeviceInfo.prototype, "type", void 0);
DeviceInfo = __decorate([
    (0, mongoose_1.Schema)({ timestamps: false, versionKey: false })
], DeviceInfo);
let UserDevice = class UserDevice {
};
exports.UserDevice = UserDevice;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", Object)
], UserDevice.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '', index: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "deviceToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'Web', enum: ["Web", "Android", "iOS"], index: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "deviceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '', index: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "ip", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserDevice.prototype, "ip_lat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserDevice.prototype, "ip_long", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BrowserInfo }),
    __metadata("design:type", Object)
], UserDevice.prototype, "browserInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: DeviceInfo }),
    __metadata("design:type", Object)
], UserDevice.prototype, "deviceInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: OperatingSystemInfo }),
    __metadata("design:type", Object)
], UserDevice.prototype, "operatingSystem", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null, index: true }),
    __metadata("design:type", Object)
], UserDevice.prototype, "last_active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserDevice.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserDevice.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserDevice.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserDevice.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '', index: true, unique: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "accessToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], UserDevice.prototype, "expired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: user_role_enum_1.UserRole, index: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], UserDevice.prototype, "isLoggedOut", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], UserDevice.prototype, "isDeleted", void 0);
exports.UserDevice = UserDevice = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true, collection: 'user_devices' })
], UserDevice);
exports.UserDeviceSchema = mongoose_1.SchemaFactory.createForClass(UserDevice);
