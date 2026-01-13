import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { resolve } from 'node:path';

import { AppModule } from './app.module';
import { ApiValidationPipe } from './common/pipes/validation.pipe';
import { CustomExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { Logger } from '@nestjs/common';
import { QueueModule } from '@common/queue/queue.module';

async function bootstrap() {
  const env = process.env.NODE_ENV || 'development';
  console.info('\x1b[36m%s\x1b[0m', '🚀 Bootstrap:', `Starting application in [${env.toUpperCase()}] mode`);
  console.info('\x1b[32m%s\x1b[0m', '🔧 Node Version:', process.version);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.use(compression());
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  // Setup Bull Board
  const queueModule = app.get(QueueModule);
  queueModule.setupBullBoard(app);

  // Apply global pipes, interceptors, and filters
  app.setGlobalPrefix('/api');
  app.enableVersioning();
  app.useGlobalPipes(new ApiValidationPipe()); // For validating incoming data
  app.useGlobalInterceptors(new ResponseInterceptor()); // Intercept outgoing responses
  app.useGlobalFilters(new CustomExceptionFilter()); // Handle exceptions

  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));

  if (configService.getOrThrow('NODE_ENV') === 'development') {
    const createConfig = (title: string, description: string) => {
      return new DocumentBuilder().setOpenAPIVersion('3.1.0').addBearerAuth().setTitle(title).setDescription(description).setVersion('1.0').addTag('Auth').addServer(configService.get('HOST')).build();
    };

    const configAdmin = createConfig(
      `${configService.get('PROJECT_NAME')} Admin panel API`,
      `The Admin panel API. <br><br> API endpoints for Frontend application API. <br> <a  href="/apidoc/v1/user"> Frontend application API-Doc </a> <br><br> 📥 OpenAPI JSON (Postman): <code>${configService.get('HOST')}/apidoc/v1/admin/openapi.json</code>`,
    );
    const configApi = createConfig(
      `${configService.get('PROJECT_NAME')} Frontend application API`,
      `The User API. <br><br> API endpoints for Admin panel API. <br> <a  href="/apidoc/v1/admin"> Admin panel API-Doc </a> <br><br> 📥 OpenAPI JSON (Postman): <code>${configService.get('HOST')}/apidoc/v1/user/openapi.json</code>`,
    );

    const documentAdmin = SwaggerModule.createDocument(app, configAdmin);
    const documentApi = SwaggerModule.createDocument(app, configApi);

    // Admin APIDoc URL
    SwaggerModule.setup(
      'apidoc/v1/admin',
      app,
      {
        ...documentAdmin,
        paths: Object.fromEntries(Object.entries(documentAdmin.paths).filter(([key]) => key.includes('admin'))),
      },
      {
        swaggerOptions: {
          defaultModelsExpandDepth: -1, // Hides the Schemas section
        },
        jsonDocumentUrl: 'apidoc/v1/admin/openapi.json',
      },
    );
    // User APIDoc URL
    SwaggerModule.setup(
      'apidoc/v1/user',
      app,
      {
        ...documentApi,
        paths: Object.fromEntries(Object.entries(documentApi.paths).filter(([key]) => !key.includes('admin'))),
      },
      {
        swaggerOptions: {
          defaultModelsExpandDepth: -1, // Hides the Schemas section
        },
        jsonDocumentUrl: 'apidoc/v1/user/openapi.json',
      },
    );
  }

  await app.listen(configService.getOrThrow('PORT'), () => {
    logger.log(`${configService.get('PROJECT_NAME')} API is running: ${configService.get('HOST')}`);
    logger.log(`${configService.get('PROJECT_NAME')} Admin portal API Swagger doc is running: ${configService.get('HOST')}/apidoc/v1/admin`);
    logger.log(`${configService.get('PROJECT_NAME')} User portal API Swagger doc is running: ${configService.get('HOST')}/apidoc/v1/user`);
  });
}

bootstrap().catch(console.error);
