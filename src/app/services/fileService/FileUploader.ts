import { File } from './types/File';
import { UploadedFile } from '../../../domain/entities/UploadedFile';
export interface FileUploader {
  upload(file: File | File[]): Promise<UploadedFile | UploadedFile[]>;
  update(url: string, file: File): Promise<UploadedFile>;
  delete(url: string): Promise<UploadedFile>;
}
