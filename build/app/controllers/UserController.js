var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserResponseDTO } from '../DTO/UserResponseDTO.js';
export class UserController {
    constructor(UserService, tokenService) {
        this.UserService = UserService;
        this.tokenService = tokenService;
        this.SubscribeUser = this.SubscribeUser.bind(this);
        this.getRecomendUser = this.getRecomendUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.unSubscribeUser = this.unSubscribeUser.bind(this);
    }
    static getInstance(UserService, tokenService) {
        return new UserController(UserService, tokenService);
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const user = yield this.UserService.findById(Number(userId));
                if (!user) {
                    res.json({ error: 'user doesn`t exist' });
                    return;
                }
                const id = user.id;
                const jwtid = this.tokenService.returnPayload(req.headers.authorization);
                const checkfollow = yield this.UserService.isSubscribed(jwtid, id);
                const response = new UserResponseDTO(user, checkfollow === null || checkfollow === void 0 ? void 0 : checkfollow.subscribed);
                res.locals.apiResponse = response;
                next();
            }
            catch (error) {
                res.status(400).json({ error });
            }
        });
    }
    SubscribeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const userId = this.tokenService.returnPayload(req.headers.authorization);
            try {
                yield this.UserService.subcsribe(userId, id);
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    unSubscribeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const userId = this.tokenService.returnPayload(req.headers.authorization);
            try {
                yield this.UserService.unsubcsribe(userId, id);
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    getRecomendUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const users = yield this.UserService.recomend(+userId);
                console.log(users);
                return res.json(users);
            }
            catch (error) {
                console.log(error);
                return res.json(error);
            }
        });
    }
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                if (query && query.length) {
                    const users = yield this.UserService.search(String(query));
                    return res.json(users);
                }
                else {
                    return res.json([]);
                }
            }
            catch (error) {
                console.log(error);
                return res.json(error);
            }
        });
    }
}
