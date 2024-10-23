import { randomUUID } from 'crypto';
import { FileUploader } from '../../../domain/interfaces/FileUploader';
import { writeFile, rm } from 'fs/promises';
import { File } from './types/File';
export class LocalUploader implements FileUploader {
  constructor(private url = process.env.LOCAL_STORAGE_PATH) {}
  async upload(file: File | File[]) {
    try {
      if (Array.isArray(file)) {
        const files = await Promise.all(
          file.map(async (file) => {
            const path = this.generatePath();
            await writeFile(path, file.data);
            return path;
          })
        );

        return files.map((path) => ({ path }));
      } else {
        const path = this.generatePath();
        await writeFile(path, file.data);
        return { path };
      }
    } catch (error) {
      throw new Error('');
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
  private generatePath(): string {
    return `${this.url}/${randomUUID()}`;
  }
}
