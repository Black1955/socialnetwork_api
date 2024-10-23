import { UploadedFile } from '../entities/UploadedFile';
import { File } from '../../app/services/fileService/types/File';
export interface FileUploader {
  upload(file: File | File[]): Promise<UploadedFile | UploadedFile[]>;
  update(url: string, file: File): Promise<UploadedFile>;
  delete(url: string): Promise<UploadedFile>;
}
