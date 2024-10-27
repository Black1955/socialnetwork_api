import { Post } from '../../entities/Post.js';
import { PostRepo } from '../../interfaces/PostRepo.js';
import { PostStrategy } from './PostStrategy.js';

export class BlogPostStrategy implements PostStrategy {
  private repo;
  constructor(repo: PostRepo) {
    this.repo = repo;
  }
  async getPosts(
    id: number,
    page?: number,
    limit?: number,
    myId?: number
  ): Promise<Post[]> {
    console.log('blogpoststrategy');
    return await this.repo.getBlogPost(id, page, limit, myId);
  }
}
