import { randomUUID } from 'crypto';
import { FileUploader } from '../../../domain/interfaces/FileUploader.js';
import { writeFile, rm } from 'fs/promises';
import { File } from './types/File.js';
import { LOCAL_STORAGE_PATH } from '../../../configs/checkENV.js';
export class LocalUploader implements FileUploader {
  constructor(private url = LOCAL_STORAGE_PATH) {}
  async upload(file: File | File[]) {
    try {
      if (Array.isArray(file)) {
        const files = await Promise.all(
          file.map(async (file) => {
            const path = this.generatePath(file);
            await writeFile(path, file.data);
            return path;
          })
        );
        return files.map((path) => ({ path }));
      } else {
        const path = this.generatePath(file);
        await writeFile(path, file.data);
        return { path };
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async update(url: string, file: File) {
    try {
      await writeFile(url, file.data);
      return { path: url };
    } catch (error) {
      throw new Error('');
    }
  }
  async delete(url: string) {
    try {
      await rm(url);
      return { path: url };
    } catch (error) {
      throw new Error('');
    }
  }
  private generatePath(file: File): string {
    const mimeTypes: { [key: string]: string } = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
    };
    return `${this.url}/${randomUUID()}.${mimeTypes[file.mimetype]}`;
  }
}
