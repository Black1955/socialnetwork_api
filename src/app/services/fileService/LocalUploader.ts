import { randomUUID } from 'crypto';
import { FileUploader } from '../../../domain/interfaces/FileUploader.js';
import { writeFile, rm } from 'fs/promises';
import { File } from './types/File.js';
import { LOCAL_STORAGE_PATH } from '../../../configs/checkENV.js';
import path from 'path';
export class LocalUploader implements FileUploader {
  constructor(private url = path.join(process.cwd(), LOCAL_STORAGE_PATH)) {}
  async upload(file: File | File[]) {
    try {
      if (Array.isArray(file)) {
        const files = await Promise.all(
          file.map(async (file) => {
            const { path_for_saving, path } = this.generatePath(file);
            await writeFile(path_for_saving, file.data);
            return path;
          })
        );
        return files.map((path) => ({ path }));
      } else {
        const { path_for_saving, path } = this.generatePath(file);
        await writeFile(path_for_saving, file.data);
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
  private generatePath(file: File) {
    const mimeTypes: { [key: string]: string } = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
    };
    const name = randomUUID();
    return {
      path_for_saving: `${this.url}/${name}.${mimeTypes[file.mimetype]}`,
      path: `${name}.${mimeTypes[file.mimetype]}`,
    };
  }
}
