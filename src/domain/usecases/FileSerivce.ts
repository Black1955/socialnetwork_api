import { File } from '../../app/services/fileService/types/File';
import { FileUpload } from '../interfaces/FileUpload';
import { FileUploader } from '../interfaces/FileUploader';
export class FileService implements FileUpload {
  private uploader;
  constructor(uploader: FileUploader) {
    this.uploader = uploader;
    this.upload = this.upload.bind(this);
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
