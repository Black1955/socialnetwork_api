import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
export class TokenService {
  createToken(payload: string) {
    const token = jsonwebtoken.sign({ payload }, process.env.FRASE!, {
      expiresIn: '10h',
    });
    return token;
  }
  returnPayload(token: string) {
    if (jsonwebtoken != null) {
      const decoded = jsonwebtoken.decode(token);
      if (decoded && typeof decoded === 'object' && 'payload' in decoded) {
        return decoded.payload;
      }
    }
    return null;
  }
}
