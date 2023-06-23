import pool from "../db.js";
import fs from "fs";
class fileService {
  async setFile(id, file, table, fileField) {
    const prevurl = await pool.query(
      `SELECT ${fileField} from ${table} WHERE id = $1`,
      [id]
    );
    if (
      prevurl.rows[0][fileField] &&
      fs.existsSync(prevurl.rows[0][fileField])
    ) {
      fs.unlinkSync(prevurl.rows[0][fileField]);
    }
    return await pool.query(
      `UPDATE ${table} SET ${fileField} = $1 WHERE id = $2 RETURNING ${fileField}`,
      [file.path, id]
    );
  }
}

export default new fileService();
