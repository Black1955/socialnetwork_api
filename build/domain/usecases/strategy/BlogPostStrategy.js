export class BlogPostStrategy {
    constructor(repo) {
        this.repo = repo;
    }
    getPosts(id, page, limit, myId) {
        return this.repo.getBlogPost(id, page, limit, myId);
    }
}
