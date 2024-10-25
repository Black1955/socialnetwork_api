export class LikedPostStrategy {
    constructor(repo) {
        this.repo = repo;
    }
    getPosts(id, page, limit, myId) {
        return this.repo.getLikedPost(id, page, limit, myId);
    }
}
