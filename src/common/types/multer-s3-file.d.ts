// src/types/multer-s3-file.d.ts
import 'multer';

declare module 'multer' {
  export interface MulterS3File extends Express.Multer.File {
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    contentDisposition?: string;
    storageClass?: string;
    serverSideEncryption?: string;
    metadata?: any;
    location: string; // <-- S3 public URL
    etag: string;
  }
}

export interface MulterS3File extends Express.Multer.File {
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition?: string;
  storageClass?: string;
  serverSideEncryption?: string;
  metadata?: any;
  location: string; // <-- S3 public URL
  etag: string;
}
