import { UploadedFile } from 'express-fileupload';
import { FileUpload } from './FileUpload';
import { FileUploader } from './FileUploader';
import { File } from './types/File';
export class FileService implements FileUpload {
  private uploader;
  constructor(uploader: FileUploader) {
    this.uploader = uploader;
    this.upload = this.upload.bind(this);
  }
  async upload(file: File[]) {
    return this.uploader.upload(file);
  }
  async update(url: string, file: File) {
    return this.uploader.update(url, file);
  }
  async delete(url: string) {
    return this.uploader.delete(url);
  }
}
