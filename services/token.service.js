import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
class tokenService {
  createToken(payload) {
    const token = jsonwebtoken.sign({ payload }, process.env.FRASE, {
      expiresIn: "10h",
    });
    return token;
  }
  returnPayload(token) {
    return jsonwebtoken.decode(token).payload;
  }
}

export default new tokenService();
