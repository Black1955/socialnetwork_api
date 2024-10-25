import { Post } from '../../entities/Post.js';
import { PostRepo } from '../../interfaces/PostRepo.js';
import { PostStrategy } from './PostStrategy.js';

export class PopularPostStrategy implements PostStrategy {
  private repo;
  constructor(repo: PostRepo) {
    this.repo = repo;
  }
  getPosts(
    id: number,
    page: number,
    limit: number,
    myId: number
  ): Promise<Post[]> {
    return this.repo.getPopularPost(id, page, limit, myId);
  }
}
