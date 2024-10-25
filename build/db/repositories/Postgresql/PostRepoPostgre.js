var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from '../../../configs/db.js';
export class PostRepoPostgre {
    getBlogPost(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield pool.query('SELECT * FROM blogposts($1,$2,$3,$4)', [id, limit, page]);
            return res.rows[0];
        });
    }
    getFollowingPost(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield pool.query('SELECT * FROM followsposts($1,$2,$3)', [id, limit, page]);
            return res.rows[0];
        });
    }
    getLikedPost(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield pool.query('SELECT * FROM likedPosts($1,$2,$3,$4)', [id, limit, page]);
            return res.rows[0];
        });
    }
    getNewPost(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield pool.query('SELECT * from newposts($1,$2,$3,$4)', [id, limit, page]);
            return res.rows[0];
        });
    }
    getPopularPost(id, page, limit, myId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield pool.query('select * from popularblog($1,$2,$3)', [id, limit, page]);
            return res.rows[0];
        });
    }
    create(title, description, user_id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield pool.query('INSERT INTO posts (title,description, user_id,img_url) values ($1,$2,$3,$4) RETURNING *', [title, description, user_id, url.length ? url : null]);
                return res.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('post hasn`t been created');
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield pool.query('DELETE FROM posts WHERE id = $1', [id]);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield pool.query('SELECT * FROM posts WHERE user_id = $1', [id]);
                return res.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('');
            }
        });
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield pool.query('SELECT * FROM posts WHERE id = $1', [
                    id,
                ]);
                return res.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('');
            }
        });
    }
    like(id, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield pool.query('INSERT INTO likes (user_id,post_id) values ($1,$2)'),
                    [id, post_id];
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    dislike(id, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2 ', [id, post_id]);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getLikes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield pool.query('select count(*) as likes from likes where post_id = $1', [id]);
                return post.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('');
            }
        });
    }
    getRecomend() {
        throw new Error('Method not implemented.');
    }
    change() {
        throw new Error('Method not implemented.');
    }
}
