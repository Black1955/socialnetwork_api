var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Context } from './strategy/Context.js';
import { StrategyMapper } from './strategy/StrategyMaper.js';
export class PostService {
    constructor(Factory, fileService) {
        this.FileService = fileService;
        this.PostRepo = Factory.CreatePostRepository();
    }
    create(title, user_id, description, File) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (typeof title !== 'string' || !title.trim()) {
                throw new Error('Title is empty or not a string');
            }
            let url;
            try {
                if (File) {
                    const fileToUpload = Array.isArray(File) ? File[0] : File;
                    const file = yield this.FileService.upload(fileToUpload);
                    url = Array.isArray(file) ? (_a = file[0]) === null || _a === void 0 ? void 0 : _a.path : file === null || file === void 0 ? void 0 : file.path;
                }
                return yield this.PostRepo.create(title, description, user_id, url);
            }
            catch (error) {
                console.error('Error creating post:', error);
                throw new Error('Failed to create post');
            }
        });
    }
    delete(id) {
        try {
            return this.PostRepo.delete(id);
        }
        catch (error) { }
    }
    getPost(id) {
        try {
            return this.PostRepo.getPost(id);
        }
        catch (error) { }
    }
    getPosts(id, page, limit, myId, type) {
        try {
            const strategy = StrategyMapper(type, this.PostRepo);
            console.log('strategy', strategy);
            const context = new Context(strategy);
            return context.execute(id, page, limit, myId);
        }
        catch (error) { }
    }
    getUserPosts(id) {
        return this.PostRepo.getPosts(id);
    }
    like(id, post_id) {
        return this.PostRepo.like(id, post_id);
    }
    disLike(id, post_id) {
        return this.PostRepo.dislike(id, post_id);
    }
    getLikes(id) {
        return this.PostRepo.getLikes(id);
    }
}
