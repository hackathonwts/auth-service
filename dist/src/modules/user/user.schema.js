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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt_1 = require("bcrypt");
const utils_helper_1 = require("../../helpers/utils.helper");
const social_auth_helper_1 = require("../../helpers/social-auth.helper");
const status_enum_1 = require("../../common/enum/status.enum");
const common_enum_1 = require("../../common/enum/common.enum");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_2.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, mongoose_2.Prop)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], User.prototype, "countryCode", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "phoneVerified", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: mongoose_1.Schema.Types.ObjectId, ref: 'Role', index: true }),
    __metadata("design:type", Object)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: String,
        enum: Object.values(status_enum_1.StatusEnum),
        default: status_enum_1.StatusEnum.Active,
        index: true,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: String,
        enum: Object.values(common_enum_1.LoginMethod),
        default: common_enum_1.LoginMethod.PHONE,
        index: true,
    }),
    __metadata("design:type", String)
], User.prototype, "loginMethod", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: String,
        enum: Object.values(common_enum_1.RegistrationType),
        default: common_enum_1.RegistrationType.MANUAL,
        index: true,
    }),
    __metadata("design:type", String)
], User.prototype, "registrationType", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: String,
        enum: Object.values(social_auth_helper_1.SocialProvider),
        index: true,
    }),
    __metadata("design:type", String)
], User.prototype, "socialProvider", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], User.prototype, "socialProviderId", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: String,
        enum: Object.values(common_enum_1.GenderEnum),
        index: true,
    }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], User.prototype, "dob", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, maxlength: 250 }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "galleryPhotos", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
        default: [],
        index: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "interests", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: String,
        enum: Object.values(common_enum_1.PreferredGenderEnum),
        default: common_enum_1.PreferredGenderEnum.ANY,
    }),
    __metadata("design:type", String)
], User.prototype, "preferredGender", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: String,
        enum: Object.values(common_enum_1.LookingForEnum),
        default: common_enum_1.LookingForEnum.BOTH,
        index: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lookingFor", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Number, min: 1, max: 100, default: 25 }),
    __metadata("design:type", Number)
], User.prototype, "locationRange", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "location", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: [
            {
                questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question' },
                answer: String,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "questions", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "faceVerified", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "faceVerificationImage", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isOnboarded", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isProfileVisible", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isAgeVisible", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "emailNotifications", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "smsNotifications", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "pushNotifications", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "emailReminders", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "smsReminders", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "pushReminders", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
exports.User = User = __decorate([
    (0, mongoose_2.Schema)({ timestamps: true, versionKey: false })
], User);
exports.UserSchema = mongoose_2.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 }, { unique: true, sparse: true });
exports.UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
exports.UserSchema.index({ socialProvider: 1, socialProviderId: 1 }, { unique: true, sparse: true });
exports.UserSchema.index({ location: '2dsphere' });
exports.UserSchema.index({
    gender: 1,
    preferredGender: 1,
    lookingFor: 1,
    isOnboarded: 1,
    isProfileVisible: 1,
});
exports.UserSchema.methods.validPassword = function (password) {
    return this.password ? (0, bcrypt_1.compareSync)(password, this.password) : false;
};
exports.UserSchema.methods.generateHash = function (password) {
    return (0, bcrypt_1.hashSync)(password, (0, bcrypt_1.genSaltSync)(+process.env.SALT_ROUND));
};
exports.UserSchema.pre('save', async function (next) {
    let user = this;
    user = (0, utils_helper_1.synchronizeNameFields)(user);
    if (user.password && user.isModified('password')) {
        const salt = await (0, bcrypt_1.genSalt)(10);
        const hash = (0, bcrypt_1.hashSync)(user.password, salt);
        user.password = hash;
    }
    next();
});
exports.UserSchema.pre('findOneAndUpdate', async function (next) {
    let update = this.getUpdate();
    if (!update)
        return next();
    update = (0, utils_helper_1.synchronizeNameFields)(update);
    if (update.password) {
        const salt = await (0, bcrypt_1.genSalt)(10);
        update.password = (0, bcrypt_1.hashSync)(update.password, salt);
    }
    this.setUpdate(update);
    next();
});
