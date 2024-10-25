export class PopularPostStrategy {
    constructor(repo) {
        this.repo = repo;
    }
    getPosts(id, page, limit, myId) {
        return this.repo.getPopularPost(id, page, limit, myId);
    }
}
