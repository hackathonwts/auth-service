"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.LoginMethod = exports.RegistrationType = exports.PreferredGenderEnum = exports.LookingForEnum = exports.GenderEnum = exports.VerificationTypeEnum = void 0;
var VerificationTypeEnum;
(function (VerificationTypeEnum) {
    VerificationTypeEnum["EMAIL_VERIFY"] = "email-verify";
    VerificationTypeEnum["PHONE_VERIFY"] = "phone-verify";
    VerificationTypeEnum["LOGIN_VERIFY"] = "login-verify";
    VerificationTypeEnum["FORGOT_PASSWORD"] = "forgot-password";
})(VerificationTypeEnum || (exports.VerificationTypeEnum = VerificationTypeEnum = {}));
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "male";
    GenderEnum["FEMALE"] = "female";
    GenderEnum["OTHER"] = "other";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var LookingForEnum;
(function (LookingForEnum) {
    LookingForEnum["SOLO"] = "solo";
    LookingForEnum["CREW"] = "crew";
    LookingForEnum["BOTH"] = "both";
})(LookingForEnum || (exports.LookingForEnum = LookingForEnum = {}));
var PreferredGenderEnum;
(function (PreferredGenderEnum) {
    PreferredGenderEnum["MALE"] = "male";
    PreferredGenderEnum["FEMALE"] = "female";
    PreferredGenderEnum["ANY"] = "any";
})(PreferredGenderEnum || (exports.PreferredGenderEnum = PreferredGenderEnum = {}));
var RegistrationType;
(function (RegistrationType) {
    RegistrationType["MANUAL"] = "manual";
    RegistrationType["SOCIAL"] = "social";
})(RegistrationType || (exports.RegistrationType = RegistrationType = {}));
var LoginMethod;
(function (LoginMethod) {
    LoginMethod["EMAIL"] = "email";
    LoginMethod["PHONE"] = "phone";
    LoginMethod["SOCIAL"] = "social";
})(LoginMethod || (exports.LoginMethod = LoginMethod = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "Active";
    UserStatus["INACTIVE"] = "Inactive";
    UserStatus["BLOCKED"] = "Blocked";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
