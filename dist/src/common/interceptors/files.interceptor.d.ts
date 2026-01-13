import { S3Client } from '@aws-sdk/client-s3';
export declare const allowedMimeTypes: string[];
interface SingleFileInterceptorOptions {
    directory: string;
    fieldName: string;
    storage?: 'local' | 's3';
    maxCount?: number;
    maxFileSize?: number;
}
interface MultiFileInterceptorOptions {
    fileFields: {
        name: string;
        directory: string;
        maxCount?: number;
    }[];
    storage?: 'local' | 's3';
    maxFileSize?: number;
}
interface AnyFilesInterceptorOptions {
    directory: string;
    storage?: 'local' | 's3';
    maxCount?: number;
    maxFileSize?: number;
}
export declare const s3Client: S3Client;
export declare const uploadSingleFileInterceptor: (options: SingleFileInterceptorOptions) => import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare const uploadMultiFileInterceptor: (options: MultiFileInterceptorOptions) => import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare const uploadAnyFilesInterceptor: (options: AnyFilesInterceptorOptions) => import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare const deleteLocalFile: (fileName: string, directory: string) => void;
export declare const SingleFileInterceptor: (directory: string, fieldName: string) => import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare const MultiFileInterceptor: (fileFields: {
    name: string;
    directory: string;
    maxCount?: number;
}[]) => import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export {};
