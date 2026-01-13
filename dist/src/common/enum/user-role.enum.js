"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleGroup = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMINISTRATOR"] = "administrator";
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var RoleGroup;
(function (RoleGroup) {
    RoleGroup["BACKEND"] = "backend";
    RoleGroup["FRONTEND"] = "frontend";
})(RoleGroup || (exports.RoleGroup = RoleGroup = {}));
