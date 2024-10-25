import { PostRepo } from '../../interfaces/PostRepo.js';
import { BlogPostStrategy } from './BlogPostStrategy.js';
import { FollowingPostStrategy } from './FollowingPostStrategy.js';
import { LikedPostStrategy } from './LikedPostStrategy.js';
import { NewPostStrategy } from './NewPostStrategy.js';
import { PopularPostStrategy } from './PopularPostStrategy.js';
import { PostStrategy } from './PostStrategy.js';

export function StrategyMapper(type: string, repo: PostRepo): PostStrategy {
  switch (type) {
    case 'following':
      return new FollowingPostStrategy(repo);
    case 'liked':
      return new LikedPostStrategy(repo);
    case 'popular':
      return new PopularPostStrategy(repo);
    case 'new':
      return new NewPostStrategy(repo);
    case 'blog':
      return new BlogPostStrategy(repo);
    default:
      throw new Error('type in incorrect');
  }
}
