export class FollowingPostStrategy {
    constructor(repo) {
        this.repo = repo;
    }
    getPosts(id, page, limit, myId) {
        return this.repo.getFollowingPost(id, page, limit, myId);
    }
}
