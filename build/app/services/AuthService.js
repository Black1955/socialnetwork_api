var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiError } from './ErrorService.js';
import bccrypt from 'bcrypt';
export class AuthService {
    constructor(userService, tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }
    signin(password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.validate(email, password);
                const token = this.tokenService.createToken(String(user.id));
                return token;
            }
            catch (error) {
                throw ApiError.BadRequest('incorrect email or password');
            }
        });
    }
    signup(password, email, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findByEmail(email);
            if (user) {
                throw new ApiError(400, 'the user already exists');
            }
            const newpassword = yield bccrypt.hash(password, 5);
            const newUser = yield this.userService.create(email, newpassword, nickname);
            const token = this.tokenService.createToken(String(newUser === null || newUser === void 0 ? void 0 : newUser.id));
            return token;
        });
    }
    refresh(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.findById(+id);
                const token = this.tokenService.createToken(id);
                return { user, token };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
