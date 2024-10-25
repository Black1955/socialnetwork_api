import { PostRepo } from '../interfaces/PostRepo.js';
import { UserRepo } from '../interfaces/UserRepo.js';

export interface RepositoryFactory {
  CreateUserRepository(): UserRepo;
  CreatePostRepository(): PostRepo;
}
