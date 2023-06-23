import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
export default function tokenMiddleware(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.clearCookie("token");
      res.json({ access: false, massage: "unvalid token" });
    }
    const user = jsonwebtoken.verify(token, process.env.FRASE);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}
