import { PostRepo } from '../../interfaces/PostRepo';
import { BlogPostStrategy } from './BlogPostStrategy';
import { FollowingPostStrategy } from './FollowingPostStrategy';
import { LikedPostStrategy } from './LikedPostStrategy';
import { NewPostStrategy } from './NewPostStrategy';
import { PopularPostStrategy } from './PopularPostStrategy';
import { PostStrategy } from './PostStrategy';

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
