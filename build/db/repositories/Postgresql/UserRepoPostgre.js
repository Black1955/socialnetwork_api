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
export class UserRepoPostgre {
    create(email, password, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield pool.query('INSERT INTO users (email,password,nickname) VALUES ($1,$2,$3) RETURNING *', [email, password, nickname]);
                return res.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('Error creating user');
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield pool.query('SELECT id, nickname, name, description, followers, following, avatar_url, back_url, email FROM users WHERE email = $1', [email]);
                return data.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('there is no user with this email');
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield pool.query('SELECT id, nickname, name, description, followers, following, avatar_url, back_url, email FROM users WHERE id = $1', [id]);
                return data.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('there is no user');
            }
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!query.length) {
                throw new Error('query is ampty');
            }
            else {
                try {
                    const data = yield pool.query(`SELECT nickname,avatar_url,id FROM users WHERE LOWER(nickname) LIKE '${query}%' OR LOWER(name) LIKE '${query}%'`);
                    return data.rows[0];
                }
                catch (error) {
                    console.log(error);
                    throw new Error('there is no user');
                }
            }
        });
    }
    update() {
        throw new Error('Method not implemented.');
    }
    isSybscribed(myId, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield pool.query('SELECT EXISTS (SELECT * FROM follows WHERE subscriber_id = $1 and target_user_id = $2) AS subscribed', [myId, user_id]);
                return data.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('');
            }
        });
    }
    subscribe(myId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield pool.query('INSERT INTO follows (subscriber_id,target_user_id) values ($1,$2)', [myId, userId]);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    unSubscribe(myId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield pool.query('DELETE FROM follows WHERE subscriber_id = $1 AND target_user_id = $2', [myId, userId]);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    recomend(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield pool.query('SELECT * from recomendusers($1)', [id]);
                return users.rows[0];
            }
            catch (error) {
                console.log(error);
                throw new Error('');
            }
        });
    }
}
