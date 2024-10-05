import { PostRepo } from '../interfaces/PostRepo';
import { UserRepo } from '../interfaces/UserRepo';
import { PostRepoPostgre } from '../../db/repositories/Postgresql/PostRepoPostgre';
import { UserRepoPostgre } from '../../db/repositories/Postgresql/UserRepoPostgre';
import { RepositoryFactory } from './RepositoryFactory';

export class PostgresRepoFactory implements RepositoryFactory {
  CreateUserRepository(): UserRepo {
    return new UserRepoPostgre();
  }
  CreatePostRepository(): PostRepo {
    return new PostRepoPostgre();
  }
}
