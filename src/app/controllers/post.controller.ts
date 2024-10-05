import pool from '../../configs/db.js';
import fileService from '../services/fileService/file.service.js';
import tokenService from '../services/token.service.js';
import 'dotenv/config.js';
import fetch from 'node-fetch';
import { Request, Response } from 'express';
import { PostService } from '../services/PostService.js';
export class PostContorller {
  private PostSevice;
  constructor(postService: PostService) {
    this.PostSevice = postService;
  }
  async getUserPosts(req: Request, res: Response) {
    const id = req.query.id;
    try {
      const posts = await this.PostSevice.getUserPosts(Number(id));
      if (!posts.length) {
        res.json('this user doesn`t have any posts');
        return;
      }
      res.json(posts);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  async CreateuserPost(req: Request, res: Response) {
    const id = tokenService.returnPayload(req.headers.authorization!);
    const { title, description } = req.body;
    const { policy, signature } = fileService.genereateSycret();
    const file = req.files?.post;
    let responseUrl = '';
    try {
      if (file) {
        const singleFile = Array.isArray(file) ? file[0] : file;
        const fileData = await fetch(
          `https://www.filestackapi.com/api/store/S3?key=${process.env.FILE_API_KEY}&policy=${policy}&signature=${signature}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': JSON.stringify(singleFile.mimetype),
            },
            body: JSON.stringify(singleFile.data),
          }
        );
        const response = await fileData.json();
        //@ts-expect-error make types
        responseUrl = response.url;
      }
      const data = await pool.query(
        'INSERT INTO posts (title,description, user_id,img_url) values ($1,$2,$3,$4) RETURNING *',
        [title, description, id, responseUrl.length ? responseUrl : null]
      );
      if (!data.rows.length) {
        res.json('this user doesn`t have any posts');
        return;
      }
      res.json(data.rows);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  }
  async getRecomendedPosts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const myId = tokenService.returnPayload(req.headers.authorization!);
      const { page, limit, type } = req.query;

      const posts = await this.PostSevice.getPosts(
        Number(id),
        Number(page),
        Number(limit),
        Number(myId),
        String(type)
      );
      res.json(posts);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async likePost(req: Request, res: Response) {
    const id = tokenService.returnPayload(req.headers.authorization!);
    const { post_id } = req.body;
    try {
      await this.PostSevice.like(Number(id), Number(post_id));
      const likes = await this.PostSevice.getLikes(id);
      return res.json(likes);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async dislikePost(req: Request, res: Response) {
    const id = tokenService.returnPayload(req.headers.authorization!);
    const { post_id } = req.body;
    try {
      await this.PostSevice.disLike(Number(id), Number(post_id));
      const likes = await this.PostSevice.getLikes(id);
      return res.json(likes);
    } catch (error) {
      return res.json(error);
    }
  }
  async upload(req: Request, res: Response) {
    return res.json(req.files);
  }
}
