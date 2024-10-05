import { Post } from '../../entities/Post';

export interface PostStrategy {
  getPosts(
    id: number,
    page: number,
    limit: number,
    myId: number
  ): Promise<Post[]>;
}
