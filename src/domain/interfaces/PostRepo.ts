import { Post } from '../entities/Post';

export interface PostRepo {
  create(
    title: string,
    description: string,
    user_id: number,
    url?: string
  ): Promise<Post>;
  delete(id: number): Promise<boolean>;
  getPost(id: number): Promise<Post>;
  change(post: Post): Promise<Post>;
  like(id: number, post_id: number): Promise<boolean>;
  dislike(id: number, post_id: number): Promise<boolean>;
  getRecomend(): Promise<Post[]>;
  getLikes(id: number): Promise<{ likes: number }>;
  getPosts(user_id: number): Promise<Post[]>;
  getFollowingPost(
    id: number,
    page?: number,
    limit?: number,
    myId?: number
  ): Promise<Post[]>;
  getLikedPost(
    id: number,
    page?: number,
    limit?: number,
    myId?: number
  ): Promise<Post[]>;
  getNewPost(
    id: number,
    page?: number,
    limit?: number,
    myId?: number
  ): Promise<Post[]>;
  getPopularPost(
    id: number,
    page?: number,
    limit?: number,
    myId?: number
  ): Promise<Post[]>;
  getBlogPost(
    id: number,
    page?: number,
    limit?: number,
    myId?: number
  ): Promise<Post[]>;
}
