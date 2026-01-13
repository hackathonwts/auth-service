"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const roles_json_1 = __importDefault(require("./assets/roles.json"));
const users_json_1 = __importDefault(require("./assets/users.json"));
async function migrate() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const roleModel = app.get('RoleModel');
    const userModel = app.get('UserModel');
    console.log('Connected to MongoDB');
    await roleModel.syncIndexes();
    await userModel.syncIndexes();
    console.log('Indexes created successfully');
    const existingRoles = await roleModel.countDocuments();
    if (existingRoles === 0) {
        await roleModel.insertMany(roles_json_1.default);
        console.log('Default roles inserted');
    }
    const adminRole = await roleModel.findOne({ role: 'admin' });
    if (adminRole) {
        const existingAdmin = await userModel.findOne({ email: users_json_1.default.email });
        if (!existingAdmin) {
            await userModel.create({ ...users_json_1.default, role: adminRole._id });
            console.log('Default admin user created');
        }
    }
    console.log('Migration completed successfully');
    await app.close();
}
migrate().catch((err) => {
    console.error('Migration failed:', err);
});
