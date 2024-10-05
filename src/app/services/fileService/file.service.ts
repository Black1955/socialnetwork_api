import pool from '../../../configs/db';
import fetch from 'node-fetch';
import crypto from 'crypto';
import 'dotenv/config.js';
import { UploadedFile } from 'express-fileupload';

class fileService {
  async setFile(
    id: string,
    file: UploadedFile | null | undefined,
    table: string,
    fileField: string
  ) {
    if (!file) {
      throw new Error('there is no file');
    }
    const { policy, signature } = this.genereateSycret();
    const prevurl = await pool.query(
      `SELECT ${fileField} from ${table} WHERE id = $1`,
      [id]
    );
    let newValue;
    if (prevurl.rows[0][fileField]) {
      const fileKey = prevurl.rows[0][fileField].split('com/').pop();

      const fileData = await fetch(
        `https://www.filestackapi.com/api/file/${fileKey}?policy=${policy}&signature=${signature}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': JSON.stringify(file.mimetype),
          },
          body: JSON.stringify(file.data),
        }
      );
      const response = await fileData.json();
      //@ts-expect-error make types for fetch later
      newValue = response.url;
    } else {
      const data = await fetch(
        `https://www.filestackapi.com/api/store/S3?key=${process.env.FILE_API_KEY}&policy=${policy}&signature=${signature}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': JSON.stringify(file.mimetype),
          },
          body: JSON.stringify(file.data),
        }
      );
      const response = await data.json();
      //@ts-expect-error make types for fetch later
      newValue = response.url;
    }
    return await pool.query(
      `UPDATE ${table} SET ${fileField} = $1 WHERE id = $2 RETURNING ${fileField}`,
      [newValue, id]
    );
  }
  genereateSycret() {
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

export default new fileService();
