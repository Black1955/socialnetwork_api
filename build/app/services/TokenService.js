import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
import { TOKEN } from '../../configs/checkENV.js';
export class TokenService {
    createToken(payload) {
        const token = jsonwebtoken.sign({ payload }, TOKEN, {
            expiresIn: '10h',
        });
        return token;
    }
    returnPayload(token) {
        if (jsonwebtoken != null) {
            const decoded = jsonwebtoken.decode(token);
            if (decoded && typeof decoded === 'object' && 'payload' in decoded) {
                return decoded.payload;
            }
        }
        return null;
    }
}
