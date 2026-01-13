"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseInMongodConnection = exports.RootMongooseTestModule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_2 = require("mongoose");
let mongod;
const RootMongooseTestModule = (options = {}) => mongoose_1.MongooseModule.forRootAsync({
    useFactory: async () => {
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongod.getUri();
        return {
            uri: mongoUri,
            ...options,
        };
    },
});
exports.RootMongooseTestModule = RootMongooseTestModule;
const CloseInMongodConnection = async () => {
    await (0, mongoose_2.disconnect)();
    if (mongod)
        await mongod.stop();
};
exports.CloseInMongodConnection = CloseInMongodConnection;
