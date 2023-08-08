import pool from "../db.js";
import fetch from "node-fetch";
import crypto from "crypto";
import "dotenv/config.js";
class fileService {
  async setFile(id, file, table, fileField) {
    const { policy, signature } = this.genereateSycret();
    const prevurl = await pool.query(
      `SELECT ${fileField} from ${table} WHERE id = $1`,
      [id]
    );
    let newValue;
    if (prevurl.rows[0][fileField]) {
      const fileKey = prevurl.rows[0][fileField].split("com/").pop();

      const fileData = await fetch(
        `https://www.filestackapi.com/api/file/${fileKey}?policy=${policy}&signature=${signature}`,
        {
          method: "POST",
          headers: {
            "Content-Type": file.mimetype,
          },
          body: file.data,
        }
      );
      const response = await fileData.json();
      newValue = response.url;
    } else {
      const data = await fetch(
        `https://www.filestackapi.com/api/store/S3?key=${process.env.FILE_API_KEY}&policy=${policy}&signature=${signature}`,
        {
          method: "POST",
          headers: {
            "Content-Type": file.mimetype,
          },
          body: file.data,
        }
      );
      const response = await data.json();
      newValue = response.url;
    }
    return await pool.query(
      `UPDATE ${table} SET ${fileField} = $1 WHERE id = $2 RETURNING ${fileField}`,
      [newValue, id]
    );
  }
  genereateSycret() {
    let policyObj = {
      expiry: Date.now() + 36000,
      call: [
        "pick",
        "read",
        "stat",
        "write",
        "store",
        "convert",
        "remove",
        "exif",
        "writeUrl",
        "runWorkflow",
      ],
    };
    let policyString = JSON.stringify(policyObj);
    let policy = Buffer.from(policyString).toString("base64");
    let signature = crypto
      .createHmac("sha256", process.env.SECRET_FILE)
      .update(policy)
      .digest("hex");
    return { policy, signature };
  }
}

export default new fileService();
