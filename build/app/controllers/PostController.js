var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config.js';
import { PostResponseDTO } from '../DTO/PostResponseDTO.js';
export class PostContorller {
    constructor(postService, tokenService) {
        this.postService = postService;
        this.tokenService = tokenService;
    }
    Get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            try {
                const posts = yield this.postService.getUserPosts(Number(id));
                if (!posts.length) {
                    res.json('this user doesn`t have any posts');
                    return;
                }
                const response = new PostResponseDTO(posts);
                res.locals.apiResponse = response;
                next();
            }
            catch (error) {
                res.status(400).json({ error });
            }
        });
    }
    Create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = this.tokenService.returnPayload(req.headers.authorization);
            const { title, description } = req.body;
            const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.post;
            try {
                const post = yield this.postService.create(title, description, id, file);
                const response = new PostResponseDTO(post);
                res.locals.apiResponse = response;
                next();
            }
            catch (error) {
                res.status(400).json({ error });
                console.log(error);
            }
        });
    }
    getRecomended(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const myId = this.tokenService.returnPayload(req.headers.authorization);
                const { page, limit, type } = req.query;
                const posts = yield this.postService.getPosts(Number(id), Number(page), Number(limit), Number(myId), String(type));
                const response = new PostResponseDTO(posts);
                res.locals.apiResponse = response;
                next();
            }
            catch (error) {
                console.log(error);
                return res.json(error);
            }
        });
    }
    Like(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.tokenService.returnPayload(req.headers.authorization);
            const { post_id } = req.body;
            try {
                yield this.postService.like(Number(id), Number(post_id));
                const likes = yield this.postService.getLikes(id);
                return res.json(likes);
            }
            catch (error) {
                console.log(error);
                return res.json(error);
            }
        });
    }
    Dislike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.tokenService.returnPayload(req.headers.authorization);
            const { post_id } = req.body;
            try {
                yield this.postService.disLike(Number(id), Number(post_id));
                const likes = yield this.postService.getLikes(id);
                return res.json(likes);
            }
            catch (error) {
                return res.json(error);
            }
        });
    }
    Upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.json(req.files);
        });
    }
}
