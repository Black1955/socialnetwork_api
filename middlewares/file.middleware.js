import multer from "multer";
import tokenService from "../services/token.service.js";
const storage = multer.diskStorage({
  filename(req, file, cb) {
    const type = file.mimetype.replace("image/", ".");
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        "-" +
        file.fieldname +
        "-" +
        tokenService.returnPayload(req.headers.authorization) +
        type
    );
  },
});

const types = ["image/png", "image/jpeg", "image/jpg"];

export const upload = multer({ storage: storage });
