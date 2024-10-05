import { FileUploader } from './FileUploader';
import crypto from 'crypto';
class FileStackUploader implements FileUploader {
  constructor() {}

  // async upload(file: UploadedFile): Promise<string> {
  //   const { policy, signature } = this.generateSecret();
  //   const response = await fetch(
  //     `https://www.filestackapi.com/api/store/S3?key=${process.env.FILE_API_KEY}&policy=${policy}&signature=${signature}`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': file.mimetype,
  //       },
  //       body: file.data,
  //     }
  //   );

  //   const data = await response.json();
  //   return data.url;
  // }
  // async update(url: string, file: UploadedFile): Promise<string> {
  //   const { policy, signature } = this.generateSecret();
  //   const fileKey = url.split('com/').pop();
  //   const response = await fetch(
  //     `https://www.filestackapi.com/api/file/${fileKey}?policy=${policy}&signature=${signature}`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': file.mimetype,
  //       },
  //       body: file.data,
  //     }
  //   );

  //   const data = await response.json();
  //   return data.url;
  // }

  // delete(): void {
  //   throw new Error('Method not implemented.');
  // }
  // private generateSecret() {
  //   const policyObj = {
  //     expiry: Date.now() + 36000,
  //     call: [
  //       'pick',
  //       'read',
  //       'stat',
  //       'write',
  //       'store',
  //       'convert',
  //       'remove',
  //       'exif',
  //       'writeUrl',
  //       'runWorkflow',
  //     ],
  //   };
  //   const policyString = JSON.stringify(policyObj);
  //   const policy = Buffer.from(policyString).toString('base64');
  //   const signature = crypto
  //     .createHmac('sha256', process.env.SECRET_FILE!)
  //     .update(policy)
  //     .digest('hex');
  //   return { policy, signature };
  // }
}
