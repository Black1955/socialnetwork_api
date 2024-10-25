var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiError } from '../services/ErrorService.js';
export class AuthController {
    constructor(AuthService, tokenService) {
        this.AuthService = AuthService;
        this.tokenService = tokenService;
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, nickname } = req.body;
            try {
                const token = yield this.AuthService.signup(password, email, nickname);
                return { access: true, token };
            }
            catch (error) {
                if (error instanceof ApiError) {
                    return next(error);
                }
                else {
                    return next(ApiError.Internal('An unexpected error occurred'));
                }
            }
        });
    }
    signin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email } = req.body;
            try {
                const token = yield this.AuthService.signin(password, email);
                return { access: true, token };
            }
            catch (error) {
                if (error instanceof ApiError) {
                    return next(error);
                }
                else {
                    return next(ApiError.Internal('An unexpected error occurred'));
                }
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.tokenService.returnPayload(req.headers.authorization);
            try {
                const response = yield this.AuthService.refresh(id);
                res.json(response);
            }
            catch (error) {
                if (error instanceof ApiError)
                    next(ApiError.BadRequest(error.message));
            }
        });
    }
}
