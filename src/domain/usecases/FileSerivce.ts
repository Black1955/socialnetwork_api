import { File } from '../../app/services/fileService/types/File.js';
import { FileUpload } from '../interfaces/FileUpload.js';
import { FileUploader } from '../interfaces/FileUploader.js';
export class FileService implements FileUpload {
  private uploader;
  constructor(uploader: FileUploader) {
    this.uploader = uploader;
    this.upload = this.upload.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }
  async upload(file: File | File[]) {
    return this.uploader.upload(file);
  }
  async update(url: string, file: File) {
    return this.uploader.update(url, file);
  }
  async delete(url: string) {
    return this.uploader.delete(url);
  }
}
