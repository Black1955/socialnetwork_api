import { PostStrategy } from './PostStrategy.js';

export class Context {
  private Stategy: PostStrategy;

  constructor(strategy: PostStrategy) {
    this.Stategy = strategy;
  }
  public setStrategy(strategy: PostStrategy) {
    this.Stategy = strategy;
  }
  public async execute(
    id: number,
    page: number = 1,
    limit: number = 5,
    myId: number
  ) {
    if (page < 0 || limit < 0) {
      throw new Error('page and limit have to be more then 0');
    }
    try {
      return await this.Stategy.getPosts(id, page, limit, myId);
    } catch (error) {}
  }
}
