var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bccrypt from 'bcrypt';
export class UserService {
    constructor(RepositoryFactory, fileService) {
        this.UserRepo = RepositoryFactory.CreateUserRepository();
        this.FileService = fileService;
    }
    static getInstance(RepositoryFactory, fileService) {
        return new UserService(RepositoryFactory, fileService);
    }
    create(email, password, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserRepo.create(email, password, nickname);
            }
            catch (error) {
                throw error;
            }
        });
    }
    isSubscribed(myId, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserRepo.isSybscribed(myId, user_id);
            }
            catch (error) { }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserRepo.delete(id);
            }
            catch (error) { }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserRepo.findById(id);
            }
            catch (error) { }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserRepo.findByEmail(email);
            }
            catch (error) { }
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserRepo.search(query);
            }
            catch (error) { }
        });
    }
    validate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepo.findByEmail(email);
            if (user.password.length < 0) {
                throw new Error('incorrect email or password');
            }
            const isPasswordValid = bccrypt.compareSync(password.toString(), user.password);
            if (!isPasswordValid) {
                throw new Error('incorrect email or password');
            }
            return user;
        });
    }
    subcsribe(myId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.UserRepo.subscribe(myId, userId);
        });
    }
    unsubcsribe(myId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.UserRepo.unSubscribe(myId, userId);
        });
    }
    recomend(myId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.UserRepo.recomend(myId);
        });
    }
    setAvatar() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
