import { Post } from '../../entities/Post';
import { PostRepo } from '../../interfaces/PostRepo';
import { PostStrategy } from './PostStrategy';

export class BlogPostStrategy implements PostStrategy {
  private repo;
  constructor(repo: PostRepo) {
    this.repo = repo;
  }
  getPosts(
    id: number,
    page?: number,
    limit?: number,
    myId?: number
  ): Promise<Post[]> {
    return this.repo.getBlogPost(id, page, limit, myId);
  }
}
