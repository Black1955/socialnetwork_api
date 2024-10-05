import { RepositoryFactory } from '../factory/RepositoryFactory';
import { Context } from './strategy/Context';
import { StrategyMapper } from './strategy/StrategyMaper';
export class PostService {
  private PostRepo;
  constructor(Factory: RepositoryFactory) {
    this.PostRepo = Factory.CreatePostRepository();
  }
  create(title: string, description: string, user_id: number, url?: string) {
    if (!title.length) throw new Error('title is ampty');
    try {
      return this.PostRepo.create(title, description, user_id, url);
    } catch (error) {
      console.log(error);
    }
  }
  delete(id: number) {
    try {
      return this.PostRepo.delete(id);
    } catch (error) {}
  }
  getPost(id: number) {
    try {
      return this.PostRepo.getPost(id);
    } catch (error) {}
  }

  getPosts(
    id: number,
    page: number,
    limit: number,
    myId: number,
    type: string
  ) {
    try {
      const strategy = StrategyMapper(type, this.PostRepo);
      const context = new Context(strategy);
      return context.execute(id, page, limit, myId);
    } catch (error) {}
  }
  getUserPosts(id: number) {
    return this.PostRepo.getPosts(id);
  }
  like(id: number, post_id: number) {
    return this.PostRepo.like(id, post_id);
  }
  disLike(id: number, post_id: number) {
    return this.PostRepo.dislike(id, post_id);
  }
  getLikes(id: number) {
    return this.PostRepo.getLikes(id);
  }
}
