import { PostRepoPostgre } from '../../db/repositories/Postgresql/PostRepoPostgre.js';
import { UserRepoPostgre } from '../../db/repositories/Postgresql/UserRepoPostgre.js';
export class PostgresRepoFactory {
    CreateUserRepository() {
        return new UserRepoPostgre();
    }
    CreatePostRepository() {
        return new PostRepoPostgre();
    }
}
