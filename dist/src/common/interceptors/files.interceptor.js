"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiFileInterceptor = exports.SingleFileInterceptor = exports.deleteLocalFile = exports.uploadAnyFilesInterceptor = exports.uploadMultiFileInterceptor = exports.uploadSingleFileInterceptor = exports.s3Client = exports.allowedMimeTypes = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const node_fs_1 = require("node:fs");
const multer_1 = require("multer");
const node_path_1 = require("node:path");
const multer_s3_1 = __importDefault(require("multer-s3"));
const utils_helper_1 = require("../../helpers/utils.helper");
const client_s3_1 = require("@aws-sdk/client-s3");
exports.allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'image/svg+xml'];
const allowedExtensions = new Set(['.jpeg', '.jpg', '.png', '.gif', '.pdf', '.mp4', '.svg']);
exports.s3Client = new client_s3_1.S3Client({
    endpoint: process.env.AWS_S3_ENDPOINT,
    region: process.env.AWS_REGION,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
const uploadSingleFileInterceptor = (options) => {
    const { directory, fieldName, storage = 'local', maxCount = 25, maxFileSize = 5 * 1024 * 1024 } = options;
    return (0, platform_express_1.FilesInterceptor)(fieldName, maxCount, {
        limits: { fileSize: maxFileSize },
        storage: storage === 's3'
            ? (0, multer_s3_1.default)({
                s3: exports.s3Client,
                bucket: process.env.AWS_S3_BUCKET || '',
                contentType: (_req, file, cb) => multer_s3_1.default.AUTO_CONTENT_TYPE(_req, file, cb),
                metadata: (_req, file, cb) => cb(null, { fieldName: file.fieldname }),
                key: (_req, file, cb) => {
                    const filename = (0, utils_helper_1.normalizeFilename)(file.originalname);
                    cb(null, `${directory}/${filename}`);
                },
            })
            : (0, multer_1.diskStorage)({
                destination(_req, _file, cb) {
                    if (!(0, node_fs_1.existsSync)('./public'))
                        (0, node_fs_1.mkdirSync)('./public');
                    if (!(0, node_fs_1.existsSync)('./public/uploads'))
                        (0, node_fs_1.mkdirSync)('./public/uploads');
                    if (!(0, node_fs_1.existsSync)(`./public/uploads/${directory}`))
                        (0, node_fs_1.mkdirSync)(`./public/uploads/${directory}`);
                    cb(null, `./public/uploads/${directory}`);
                },
                filename(_req, file, cb) {
                    cb(null, (0, utils_helper_1.normalizeFilename)(file.originalname));
                },
            }),
        fileFilter(_req, file, cb) {
            if (!exports.allowedMimeTypes.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
            }
            const ext = (0, node_path_1.extname)(file.originalname).toLowerCase();
            if (!allowedExtensions.has(ext)) {
                return cb(new common_1.BadRequestException(`Invalid file extension: ${ext}`), false);
            }
            cb(null, true);
        },
    });
};
exports.uploadSingleFileInterceptor = uploadSingleFileInterceptor;
const uploadMultiFileInterceptor = (options) => {
    const { fileFields, storage = 'local', maxFileSize = 5 * 1024 * 1024 } = options;
    return (0, platform_express_1.FileFieldsInterceptor)(fileFields, {
        limits: { fileSize: maxFileSize },
        storage: storage === 's3'
            ? (0, multer_s3_1.default)({
                s3: exports.s3Client,
                bucket: process.env.AWS_S3_BUCKET || '',
                contentType: (_req, file, cb) => multer_s3_1.default.AUTO_CONTENT_TYPE(_req, file, cb),
                metadata: (_req, file, cb) => cb(null, { fieldName: file.fieldname }),
                key: (_req, file, cb) => {
                    const field = fileFields.find((f) => f.name === file.fieldname);
                    if (!field)
                        return cb(new common_1.BadRequestException(`Invalid field: ${file.fieldname}`), '');
                    const filename = (0, utils_helper_1.normalizeFilename)(file.originalname);
                    cb(null, `${field.directory}/${filename}`);
                },
            })
            : (0, multer_1.diskStorage)({
                destination(_req, file, cb) {
                    const currField = fileFields.find((field) => file.fieldname === field.name);
                    if (!(0, node_fs_1.existsSync)('./public'))
                        (0, node_fs_1.mkdirSync)('./public');
                    if (!(0, node_fs_1.existsSync)('./public/uploads'))
                        (0, node_fs_1.mkdirSync)('./public/uploads');
                    if (!(0, node_fs_1.existsSync)(`./public/uploads/${currField?.directory}`)) {
                        (0, node_fs_1.mkdirSync)(`./public/uploads/${currField?.directory}`);
                    }
                    if (currField) {
                        return cb(null, `./public/uploads/${currField.directory}`);
                    }
                    return cb(new common_1.BadRequestException(`Image fieldname not allowed: ${file.fieldname}. Please ensure the fieldname matches one of the specified fields.`), '');
                },
                filename(_req, file, cb) {
                    cb(null, (0, utils_helper_1.normalizeFilename)(file.originalname));
                },
            }),
        fileFilter(_req, file, cb) {
            if (!exports.allowedMimeTypes.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
            }
            const ext = (0, node_path_1.extname)(file.originalname).toLowerCase();
            if (!allowedExtensions.has(ext)) {
                return cb(new common_1.BadRequestException(`Invalid file extension: ${ext}`), false);
            }
            cb(null, true);
        },
    });
};
exports.uploadMultiFileInterceptor = uploadMultiFileInterceptor;
const uploadAnyFilesInterceptor = (options) => {
    const { directory, storage = 'local', maxFileSize = 5 * 1024 * 1024 } = options;
    return (0, platform_express_1.AnyFilesInterceptor)({
        limits: { fileSize: maxFileSize },
        storage: storage === 's3'
            ? (0, multer_s3_1.default)({
                s3: exports.s3Client,
                bucket: process.env.AWS_S3_BUCKET || '',
                contentType: (_req, file, cb) => multer_s3_1.default.AUTO_CONTENT_TYPE(_req, file, cb),
                metadata: (_req, file, cb) => cb(null, { fieldName: file.fieldname }),
                key: (_req, file, cb) => {
                    const filename = (0, utils_helper_1.normalizeFilename)(file.originalname);
                    cb(null, `${directory}/${filename}`);
                },
            })
            : (0, multer_1.diskStorage)({
                destination(_req, _file, cb) {
                    if (!(0, node_fs_1.existsSync)(`./public/uploads/${directory}`)) {
                        (0, node_fs_1.mkdirSync)(`./public/uploads/${directory}`, { recursive: true });
                    }
                    cb(null, `./public/uploads/${directory}`);
                },
                filename(_req, file, cb) {
                    cb(null, (0, utils_helper_1.normalizeFilename)(file.originalname));
                },
            }),
        fileFilter(_req, file, cb) {
            if (!exports.allowedMimeTypes.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
            }
            const ext = (0, node_path_1.extname)(file.originalname).toLowerCase();
            if (!allowedExtensions.has(ext)) {
                return cb(new common_1.BadRequestException(`Invalid file extension: ${ext}`), false);
            }
            cb(null, true);
        },
    });
};
exports.uploadAnyFilesInterceptor = uploadAnyFilesInterceptor;
const deleteLocalFile = (fileName, directory) => {
    if (!(0, node_fs_1.existsSync)(`./public/uploads/${directory}`)) {
        console.log('Directory does not exist');
        return;
    }
    const fullPath = (0, node_path_1.join)(process.cwd(), 'public', 'uploads', directory, fileName);
    console.log('Deleting:', fullPath);
    if ((0, node_fs_1.existsSync)(fullPath)) {
        (0, node_fs_1.unlinkSync)(fullPath);
        console.log('Deleted successfully');
    }
    else {
        console.log('File not found');
    }
};
exports.deleteLocalFile = deleteLocalFile;
const SingleFileInterceptor = (directory, fieldName) => (0, exports.uploadSingleFileInterceptor)({ directory, fieldName, storage: 'local' });
exports.SingleFileInterceptor = SingleFileInterceptor;
const MultiFileInterceptor = (fileFields) => (0, exports.uploadMultiFileInterceptor)({ fileFields, storage: 'local' });
exports.MultiFileInterceptor = MultiFileInterceptor;
