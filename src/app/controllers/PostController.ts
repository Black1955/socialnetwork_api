import { TokenService } from '../services/TokenService';
import 'dotenv/config.js';
import { NextFunction, Request, Response } from 'express';
import { PostService } from '../../domain/usecases/PostService.js';
import { PostResponseDTO } from '../DTO/PostResponseDTO';
export class PostContorller {
  constructor(
    private postService: PostService,
    private tokenService: TokenService
  ) {}
  async Get(req: Request, res: Response, next: NextFunction) {
    const id = req.query.id;
    try {
      const posts = await this.postService.getUserPosts(Number(id));
      if (!posts.length) {
        res.json('this user doesn`t have any posts');
        return;
      }
      const response = new PostResponseDTO(posts);
      res.locals.apiResponse = response;
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  async Create(req: Request, res: Response, next: NextFunction) {
    const id = this.tokenService.returnPayload(req.headers.authorization!);
    const { title, description } = req.body;
    const file = req.files?.post;
    try {
      const post = await this.postService.create(title, description, id, file);
      const response = new PostResponseDTO(post);
      res.locals.apiResponse = response;
      next();
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  }
  async getRecomended(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const myId = this.tokenService.returnPayload(req.headers.authorization!);
      const { page, limit, type } = req.query;

      const posts = await this.postService.getPosts(
        Number(id),
        Number(page),
        Number(limit),
        Number(myId),
        String(type)
      );
      const response = new PostResponseDTO(posts!);
      res.locals.apiResponse = response;
      next();
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async Like(req: Request, res: Response) {
    const id = this.tokenService.returnPayload(req.headers.authorization!);
    const { post_id } = req.body;
    try {
      await this.postService.like(Number(id), Number(post_id));
      const likes = await this.postService.getLikes(id);
      return res.json(likes);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async Dislike(req: Request, res: Response) {
    const id = this.tokenService.returnPayload(req.headers.authorization!);
    const { post_id } = req.body;
    try {
      await this.postService.disLike(Number(id), Number(post_id));
      const likes = await this.postService.getLikes(id);
      return res.json(likes);
    } catch (error) {
      return res.json(error);
    }
  }
  async Upload(req: Request, res: Response) {
    return res.json(req.files);
  }
}
