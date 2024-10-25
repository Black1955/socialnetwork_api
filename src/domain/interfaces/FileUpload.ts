import { UploadedFile } from '../entities/UploadedFile.js';
import { File } from '../../app/services/fileService/types/File.js';
export interface FileUpload {
  upload(file: File | File[]): Promise<UploadedFile | UploadedFile[]>;
  update(url: string, file: File): Promise<UploadedFile>;
  delete(url: string): Promise<UploadedFile>;
}
