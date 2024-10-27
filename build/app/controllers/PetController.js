var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from '../../configs/db.js';
export class PetController {
    constructor(tokenService) {
        this.tokenService = tokenService;
        this.createPet = this.createPet.bind(this);
        this.getPets = this.getPets.bind(this);
    }
    createPet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.tokenService.returnPayload(req.headers.authorization);
            let path = null;
            try {
                const { name } = req.body;
                if (req.files) {
                    path = req.files.path;
                }
                const data = yield pool.query('INSERT INTO pets (name,img_url,user_id) values($1,$2,$3) RETURNING *', [name, path, id]);
                return res.json(data.rows[0]);
            }
            catch (error) {
                console.log(error);
                return res.json({ error: 'server error' });
            }
        });
    }
    getPets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, limit, page } = req.query;
            try {
                const pets = yield pool.query('SELECT * FROM pets where user_id = $1 limit $2 offset $3', [id, limit, page]);
                return res.json(pets.rows);
            }
            catch (error) {
                console.log(error);
                return res.json({ error: 'server error' });
            }
        });
    }
}
