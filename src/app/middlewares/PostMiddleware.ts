import { NextFunction, Request, Response } from 'express';
import { UserResponseDTO } from '../DTO/UserResponseDTO.js';
import crypto from 'crypto';
import { PostResponseDTO } from '../DTO/PostResponseDTO.js';

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
    .createHmac('sha256', process.env.SECRET_FILE!)
    .update(policy)
    .digest('hex');
  return { policy, signature };
}

export default function PostMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (res.locals.apiResponse) {
      const apiResponse = res.locals.apiResponse;
      if (apiResponse instanceof PostResponseDTO) {
        const response = apiResponse as PostResponseDTO;
        const post = response.getPost();
        const { policy, signature } = generateSecret();
        if (Array.isArray(post)) {
          const posts = post.map((post) => ({
            ...post,
            img_url: post.img_url + `?policy=${policy}&signature=${signature}`,
          }));
          response.setPost(posts);
        } else {
          if (post.img_url?.length) {
            post.img_url =
              post.img_url + `?policy=${policy}&signature=${signature}`;
            response.setPost(post);
          }
        }
        return res.status(200).json(response.getObject());
      }
    }
  } catch (error) {
    return res.status(500);
  }
}
