var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Context {
    constructor(strategy) {
        this.Stategy = strategy;
    }
    setStrategy(strategy) {
        this.Stategy = strategy;
    }
    execute(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, page = 1, limit = 5, myId) {
            if (page < 0 || limit < 0) {
                throw new Error('page and limit have to be more then 0');
            }
            try {
                return yield this.Stategy.getPosts(id, page, limit, myId);
            }
            catch (error) { }
        });
    }
}
