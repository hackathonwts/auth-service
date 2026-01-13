import 'winston-daily-rotate-file';
export declare class WinstonLoggerService {
    private readonly logger;
    constructor();
    error(message: string, trace: string): void;
    debug(message: string, trace: string): void;
}
