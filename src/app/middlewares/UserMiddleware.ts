import { NextFunction, Request, Response } from 'express';
import { UserResponseDTO } from '../DTO/UserResponseDTO.js';
import { FILESTACK, LOCAL_STORAGE_PATH } from '../../configs/checkENV.js';
import crypto from 'crypto';

function generateSecret() {
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
    .createHmac('sha256', FILESTACK.FILESTACK_SECRET_FILE!)
    .update(policy)
    .digest('hex');
  return { policy, signature };
}

export default function UserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (res.locals.apiResponse) {
      const apiResponse = res.locals.apiResponse;
      if (apiResponse instanceof UserResponseDTO) {
        const response = apiResponse as UserResponseDTO;
        if (FILESTACK.FILESTACK_API_KEY) {
          const user = response.getUser();
          const { policy, signature } = generateSecret();
          if (user.avatar_url.length > 0) {
            user.avatar_url =
              user.avatar_url + `?policy=${policy}&signature=${signature}`;
          }
          if (user.back_url.length > 0) {
            user.back_url =
              user.back_url + `?policy=${policy}&signature=${signature}`;
          }
          response.setUser(user);
        } else {
          const user = response.getUser();
          if (user.avatar_url && user.avatar_url.length > 0) {
            user.avatar_url =
              `${req.protocol}://` +
              `${req.headers.host}${LOCAL_STORAGE_PATH}/` +
              user.avatar_url;
          }
          if (user.back_url && user.back_url.length > 0) {
            user.back_url =
              `${req.protocol}://` +
              `${req.headers.host}${LOCAL_STORAGE_PATH}/` +
              user.back_url;
          }
          response.setUser(user);
        }
        return res.status(200).json(response.getObject());
      }
      return res.status(200).json(res.locals.apiResponse);
    }
  } catch (error) {
    return res.status(500);
  }
}
