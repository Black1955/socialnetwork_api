import { UploadedFile } from 'express-fileupload';
import { FileUploader } from '../../../domain/interfaces/FileUploader';
import crypto from 'crypto';
import { UploadedFile as ReturnedFile } from '../../../domain/entities/UploadedFile';
import { File } from './types/File';

export class FileStackUploader implements FileUploader {
  constructor() {}
  private async create(file: File): Promise<string> {
    const { policy, signature } = this.generateSecret();
    const response = await fetch(
      `https://www.filestackapi.com/api/store/S3?key=${process.env.FILE_API_KEY}&policy=${policy}&signature=${signature}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': file.mimetype,
        },
        body: file.data,
      }
    );

    const data = await response.json();
    return data.url;
  }
  async upload(file: File | File[]) {
    try {
      if (Array.isArray(file)) {
        const paths = await Promise.all(
          file.map(async (file) => await this.create(file))
        );
        return paths.map((path) => ({ path }));
      } else {
        const path = await this.create(file);
        return { path };
      }
    } catch (error) {
      throw new Error('');
    }
  }

  async update(url: string, file: UploadedFile) {
    const { policy, signature } = this.generateSecret();
    const fileKey = url.split('com/').pop();
    const response = await fetch(
      `https://www.filestackapi.com/api/file/${fileKey}?policy=${policy}&signature=${signature}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': file.mimetype,
        },
        body: file.data,
      }
    );

    const data = await response.json();
    return { path: data.url };
  }

  async delete(url: string) {
    const { policy, signature } = this.generateSecret();
    const fileKey = url.split('com/').pop();
    try {
      await fetch(
        `https://www.filestackapi.com/api/file/${fileKey}?policy=${policy}&signature=${signature}`,
        {
          method: 'DELETE',
        }
      );
      return { path: url };
    } catch (error) {
      throw new Error('');
    }
  }
  private generateSecret() {
    const policyObj = {
      expiry: Date.now() + 36000,
      call: [
        'pick',
        'read',
        'stat',
        'write',
        'store',
        'convert',
        'remove',
        'exif',
        'writeUrl',
        'runWorkflow',
      ],
    };
    const policyString = JSON.stringify(policyObj);
    const policy = Buffer.from(policyString).toString('base64');
    const signature = crypto
      .createHmac('sha256', process.env.SECRET_FILE!)
      .update(policy)
      .digest('hex');
    return { policy, signature };
  }
}
