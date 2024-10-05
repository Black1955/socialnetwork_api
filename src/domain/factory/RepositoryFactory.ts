import { PostRepo } from '../interfaces/PostRepo';
import { UserRepo } from '../interfaces/UserRepo';

export interface RepositoryFactory {
  CreateUserRepository(): UserRepo;
  CreatePostRepository(): PostRepo;
}
