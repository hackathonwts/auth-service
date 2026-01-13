import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '@common/logger/winston.logger';
export declare class CustomExceptionFilter implements ExceptionFilter {
    winston: WinstonLoggerService;
    configService: ConfigService;
    constructor();
    catch(exception: HttpException, host: ArgumentsHost): Response<any, Record<string, any>>;
}
