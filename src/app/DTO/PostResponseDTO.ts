import { Post } from '../../domain/entities/Post.js';

export class PostResponseDTO {
  private post: Post | Post[];

  constructor(post: Post | Post[]) {
    this.post = post;
  }
  getPost() {
    return this.post;
  }
  setPost(post: Post | Post[]) {
    this.post = post;
  }
  getObject() {
    return this.post;
  }
}
