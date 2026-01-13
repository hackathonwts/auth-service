import { BadRequestException } from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import multerS3 from 'multer-s3';
import { normalizeFilename } from '@helpers/utils.helper';
import { S3Client } from '@aws-sdk/client-s3';

//---------------------------------------CONFIGURATIONS---------------------------------------//
export const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'image/svg+xml'];
const allowedExtensions = new Set(['.jpeg', '.jpg', '.png', '.gif', '.pdf', '.mp4', '.svg']);

//---------------------------------------UNIFIED FILE UPLOAD INTERCEPTORS---------------------------------------//

interface SingleFileInterceptorOptions {
  directory: string;
  fieldName: string;
  storage?: 'local' | 's3';
  maxCount?: number;
  maxFileSize?: number;
}

interface MultiFileInterceptorOptions {
  fileFields: { name: string; directory: string; maxCount?: number }[];
  storage?: 'local' | 's3';
  maxFileSize?: number;
}

interface AnyFilesInterceptorOptions {
  directory: string;
  storage?: 'local' | 's3';
  maxCount?: number;
  maxFileSize?: number;
}

// AWS S3 Client Configuration
export const s3Client = new S3Client({
  endpoint: process.env.AWS_S3_ENDPOINT,
  region: process.env.AWS_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * @description Unified interceptor for handling single field file uploads.
 * @description Supports both local disk storage and AWS S3.
 * @param options Configuration options for the interceptor
 * @example uploadSingleFileInterceptor({ directory: 'avatars', fieldName: 'avatar', storage: 's3' })
 */
export const uploadSingleFileInterceptor = (options: SingleFileInterceptorOptions) => {
  const { directory, fieldName, storage = 'local', maxCount = 25, maxFileSize = 5 * 1024 * 1024 } = options;

  return FilesInterceptor(fieldName, maxCount, {
    limits: { fileSize: maxFileSize },
    storage:
      storage === 's3'
        ? multerS3({
            s3: s3Client,
            bucket: process.env.AWS_S3_BUCKET || '',
            contentType: (_req, file, cb) => multerS3.AUTO_CONTENT_TYPE(_req, file, cb),
            metadata: (_req, file, cb) => cb(null, { fieldName: file.fieldname }),
            key: (_req, file, cb) => {
              const filename = normalizeFilename(file.originalname);
              cb(null, `${directory}/${filename}`);
            },
          })
        : diskStorage({
            destination(_req, _file, cb) {
              if (!existsSync('./public')) mkdirSync('./public');
              if (!existsSync('./public/uploads')) mkdirSync('./public/uploads');
              if (!existsSync(`./public/uploads/${directory}`)) mkdirSync(`./public/uploads/${directory}`);
              cb(null, `./public/uploads/${directory}`);
            },
            filename(_req, file, cb) {
              cb(null, normalizeFilename(file.originalname));
            },
          }),
    fileFilter(_req, file, cb) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
      }

      const ext = extname(file.originalname).toLowerCase();
      if (!allowedExtensions.has(ext)) {
        return cb(new BadRequestException(`Invalid file extension: ${ext}`), false);
      }

      cb(null, true);
    },
  });
};

/**
 * @description Unified interceptor for handling multiple field file uploads.
 * @description Supports both local disk storage and AWS S3.
 * @param options Configuration options for the interceptor
 * @example uploadMultiFileInterceptor({ fileFields: [{ name: 'avatar', directory: 'avatars' }, { name: 'cover', directory: 'covers' }], storage: 's3' })
 */
export const uploadMultiFileInterceptor = (options: MultiFileInterceptorOptions) => {
  const { fileFields, storage = 'local', maxFileSize = 5 * 1024 * 1024 } = options;

  return FileFieldsInterceptor(fileFields, {
    limits: { fileSize: maxFileSize },
    storage:
      storage === 's3'
        ? multerS3({
            s3: s3Client,
            bucket: process.env.AWS_S3_BUCKET || '',
            contentType: (_req, file, cb) => multerS3.AUTO_CONTENT_TYPE(_req, file, cb),
            metadata: (_req, file, cb) => cb(null, { fieldName: file.fieldname }),
            key: (_req, file, cb) => {
              const field = fileFields.find((f) => f.name === file.fieldname);
              if (!field) return cb(new BadRequestException(`Invalid field: ${file.fieldname}`), '');
              const filename = normalizeFilename(file.originalname);
              cb(null, `${field.directory}/${filename}`);
            },
          })
        : diskStorage({
            destination(_req, file, cb) {
              const currField = fileFields.find((field) => file.fieldname === field.name);

              if (!existsSync('./public')) mkdirSync('./public');
              if (!existsSync('./public/uploads')) mkdirSync('./public/uploads');
              if (!existsSync(`./public/uploads/${currField?.directory}`)) {
                mkdirSync(`./public/uploads/${currField?.directory}`);
              }

              if (currField) {
                return cb(null, `./public/uploads/${currField.directory}`);
              }

              return cb(new BadRequestException(`Image fieldname not allowed: ${file.fieldname}. Please ensure the fieldname matches one of the specified fields.`), '');
            },
            filename(_req, file, cb) {
              cb(null, normalizeFilename(file.originalname));
            },
          }),
    fileFilter(_req, file, cb) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
      }

      const ext = extname(file.originalname).toLowerCase();
      if (!allowedExtensions.has(ext)) {
        return cb(new BadRequestException(`Invalid file extension: ${ext}`), false);
      }

      cb(null, true);
    },
  });
};

/**
 * @description Unified interceptor for handling any number of files from any field.
 * @description Supports both local disk storage and AWS S3.
 * @param options Configuration options for the interceptor
 * @example uploadAnyFilesInterceptor({ directory: 'uploads', storage: 's3' })
 */
export const uploadAnyFilesInterceptor = (options: AnyFilesInterceptorOptions) => {
  const { directory, storage = 'local', maxFileSize = 5 * 1024 * 1024 } = options;

  return AnyFilesInterceptor({
    limits: { fileSize: maxFileSize },
    storage:
      storage === 's3'
        ? multerS3({
            s3: s3Client,
            bucket: process.env.AWS_S3_BUCKET || '',
            contentType: (_req, file, cb) => multerS3.AUTO_CONTENT_TYPE(_req, file, cb),
            metadata: (_req, file, cb) => cb(null, { fieldName: file.fieldname }),
            key: (_req, file, cb) => {
              const filename = normalizeFilename(file.originalname);
              cb(null, `${directory}/${filename}`);
            },
          })
        : diskStorage({
            destination(_req, _file, cb) {
              if (!existsSync(`./public/uploads/${directory}`)) {
                mkdirSync(`./public/uploads/${directory}`, { recursive: true });
              }
              cb(null, `./public/uploads/${directory}`);
            },
            filename(_req, file, cb) {
              cb(null, normalizeFilename(file.originalname));
            },
          }),
    fileFilter(_req, file, cb) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
      }

      const ext = extname(file.originalname).toLowerCase();
      if (!allowedExtensions.has(ext)) {
        return cb(new BadRequestException(`Invalid file extension: ${ext}`), false);
      }

      cb(null, true);
    },
  });
};

/**
 * Deletes a file from the local storage.
 * @param {string} fileName - Name of the file to delete.
 * @param {string} directory - Directory where the file is located.
 */
export const deleteLocalFile = (fileName: string, directory: string) => {
  if (!existsSync(`./public/uploads/${directory}`)) {
    console.log('Directory does not exist');
    return;
  }
  const fullPath = join(process.cwd(), 'public', 'uploads', directory, fileName);
  console.log('Deleting:', fullPath);
  if (existsSync(fullPath)) {
    unlinkSync(fullPath);
    console.log('Deleted successfully');
  } else {
    console.log('File not found');
  }
};

//---------------------------------------LEGACY FUNCTIONS (DEPRECATED)---------------------------------------//
// Kept for backward compatibility. Consider migrating to the new unified functions above.

/** @deprecated Use uploadSingleFileInterceptor instead */
export const SingleFileInterceptor = (directory: string, fieldName: string) => uploadSingleFileInterceptor({ directory, fieldName, storage: 'local' });

/** @deprecated Use uploadMultiFileInterceptor instead */
export const MultiFileInterceptor = (fileFields: { name: string; directory: string; maxCount?: number }[]) => uploadMultiFileInterceptor({ fileFields, storage: 'local' });

