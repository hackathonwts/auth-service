"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const node_path_1 = require("node:path");
const app_module_1 = require("./app.module");
const validation_pipe_1 = require("./common/pipes/validation.pipe");
const exception_filter_1 = require("./common/filters/exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const common_1 = require("@nestjs/common");
const queue_module_1 = require("./common/queue/queue.module");
async function bootstrap() {
    const env = process.env.NODE_ENV || 'development';
    console.info('\x1b[36m%s\x1b[0m', '🚀 Bootstrap:', `Starting application in [${env.toUpperCase()}] mode`);
    console.info('\x1b[32m%s\x1b[0m', '🔧 Node Version:', process.version);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = app.get(common_1.Logger);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    });
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
    }));
    const queueModule = app.get(queue_module_1.QueueModule);
    queueModule.setupBullBoard(app);
    app.setGlobalPrefix('/api');
    app.enableVersioning();
    app.useGlobalPipes(new validation_pipe_1.ApiValidationPipe());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalFilters(new exception_filter_1.CustomExceptionFilter());
    app.useStaticAssets((0, node_path_1.resolve)('./public'));
    app.setBaseViewsDir((0, node_path_1.resolve)('./views'));
    if (configService.getOrThrow('NODE_ENV') === 'development') {
        const createConfig = (title, description) => {
            return new swagger_1.DocumentBuilder().setOpenAPIVersion('3.1.0').addBearerAuth().setTitle(title).setDescription(description).setVersion('1.0').addTag('Auth').addServer(configService.get('HOST')).build();
        };
        const configAdmin = createConfig(`${configService.get('PROJECT_NAME')} Admin panel API`, `The Admin panel API. <br><br> API endpoints for Frontend application API. <br> <a  href="/apidoc/v1/user"> Frontend application API-Doc </a> <br><br> 📥 OpenAPI JSON (Postman): <code>${configService.get('HOST')}/apidoc/v1/admin/openapi.json</code>`);
        const configApi = createConfig(`${configService.get('PROJECT_NAME')} Frontend application API`, `The User API. <br><br> API endpoints for Admin panel API. <br> <a  href="/apidoc/v1/admin"> Admin panel API-Doc </a> <br><br> 📥 OpenAPI JSON (Postman): <code>${configService.get('HOST')}/apidoc/v1/user/openapi.json</code>`);
        const documentAdmin = swagger_1.SwaggerModule.createDocument(app, configAdmin);
        const documentApi = swagger_1.SwaggerModule.createDocument(app, configApi);
        swagger_1.SwaggerModule.setup('apidoc/v1/admin', app, {
            ...documentAdmin,
            paths: Object.fromEntries(Object.entries(documentAdmin.paths).filter(([key]) => key.includes('admin'))),
        }, {
            swaggerOptions: {
                defaultModelsExpandDepth: -1,
            },
            jsonDocumentUrl: 'apidoc/v1/admin/openapi.json',
        });
        swagger_1.SwaggerModule.setup('apidoc/v1/user', app, {
            ...documentApi,
            paths: Object.fromEntries(Object.entries(documentApi.paths).filter(([key]) => !key.includes('admin'))),
        }, {
            swaggerOptions: {
                defaultModelsExpandDepth: -1,
            },
            jsonDocumentUrl: 'apidoc/v1/user/openapi.json',
        });
    }
    await app.listen(configService.getOrThrow('PORT'), () => {
        logger.log(`${configService.get('PROJECT_NAME')} API is running: ${configService.get('HOST')}`);
        logger.log(`${configService.get('PROJECT_NAME')} Admin portal API Swagger doc is running: ${configService.get('HOST')}/apidoc/v1/admin`);
        logger.log(`${configService.get('PROJECT_NAME')} User portal API Swagger doc is running: ${configService.get('HOST')}/apidoc/v1/user`);
    });
}
bootstrap().catch(console.error);
