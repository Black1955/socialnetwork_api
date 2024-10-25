import { PostRepo } from '../interfaces/PostRepo.js';
import { UserRepo } from '../interfaces/UserRepo.js';
import { PostRepoPostgre } from '../../db/repositories/Postgresql/PostRepoPostgre.js';
import { UserRepoPostgre } from '../../db/repositories/Postgresql/UserRepoPostgre.js';
import { RepositoryFactory } from './RepositoryFactory.js';

export class PostgresRepoFactory implements RepositoryFactory {
  CreateUserRepository(): UserRepo {
    return new UserRepoPostgre();
  }
  CreatePostRepository(): PostRepo {
    return new PostRepoPostgre();
  }
}
