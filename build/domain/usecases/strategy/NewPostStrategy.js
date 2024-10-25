export class NewPostStrategy {
    constructor(repo) {
        this.repo = repo;
    }
    getPosts(id, page, limit, myId) {
        return this.repo.getNewPost(id, page, limit, myId);
    }
}
