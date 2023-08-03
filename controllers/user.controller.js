import pool from "../db.js";
import bccrypt from "bcrypt";
import tokenService from "../services/token.service.js";
import fileService from "../services/file.service.js";
import { ApiError } from "../services/error.service.js";
class userController {
  async signin(req, res, next) {
    const { password, email } = req.body;
    let pass;
    try {
      const passwordq = await pool.query(
        "SELECT password, id FROM users WHERE email = $1",
        [email]
      );
      pass = passwordq;
      if (passwordq.rows.length) {
        const checkpassword = bccrypt.compareSync(
          password,
          passwordq.rows[0].password
        );
        if (checkpassword) {
          const token = tokenService.createToken(passwordq.rows[0].id);
          res.cookie("token", token, {
            httpOnly: true,
          });
          return res.json({ access: true });
        } else {
          next(ApiError.BadRequest("uncorrect password or email"));
        }
      } else {
        next(ApiError.BadRequest("uncorrect password or email"));
      }
    } catch (error) {
      next(ApiError.BadRequest(JSON.stringify(pass)));
    }
  }
  async signup(req, res, next) {
    const { password, email, nickname } = req.body;
    try {
      const isSignup = await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      );
      if (isSignup.rows.length) {
        next(ApiError.BadRequest("the user is already existed"));
      } else {
        const newpassword = await bccrypt.hash(password, 5);
        const id = await pool.query(
          "INSERT INTO users (email,password,nickname) VALUES ($1,$2,$3) RETURNING id",
          [email, newpassword, nickname]
        );
        const token = tokenService.createToken(id.rows[0].id);
        res.cookie("token", token, {
          httpOnly: true,
        });
        return res.json({ access: true });
      }
    } catch (error) {
      console.log(error);
      next(ApiError.BadRequest(error.massage));
    }
  }
  async refresch(req, res, next) {
    const id = tokenService.returnPayload(req.cookies.token);
    try {
      const profile = await pool.query(
        "SELECT id, nickname, name, description, followers, following, avatar_url, back_url, email FROM users WHERE id = $1",
        [id]
      );
      const token = tokenService.createToken(id);
      res.cookie("token", token, {
        httpOnly: true,
      });
      return res.json(profile.rows[0]);
    } catch (error) {
      next(ApiError.BadRequest(error.massage));
    }
  }
  async getUser(req, res) {
    const userId = req.params.id;
    console.log(req.params);
    try {
      const data = await pool.query(
        "SELECT id, nickname, name, description, followers, following, avatar_url, back_url, email FROM users WHERE id = $1",
        [userId]
      );
      if (!data.rows.length) {
        res.json({ error: "user doesn`t exist" });
        return;
      }
      const id = data.rows[0].id;
      const jwtid = tokenService.returnPayload(req.cookies.token);
      const checkfollow = await pool.query(
        "SELECT EXISTS (SELECT * FROM follows WHERE subscriber_id = $1 and target_user_id = $2) AS subscribed",
        [jwtid, id]
      );
      res.json({ ...data.rows[0], ...checkfollow.rows[0] });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
  async SubscribeUser(req, res) {
    const { id } = req.body;
    console.log(id);
    const userId = tokenService.returnPayload(req.cookies.token);
    try {
      await pool.query(
        "INSERT INTO follows (subscriber_id,target_user_id) values ($1,$2)",
        [userId, id]
      );
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async unSubscribeUser(req, res) {
    const { id } = req.body;
    const userId = tokenService.returnPayload(req.cookies.token);
    try {
      await pool.query(
        "DELETE FROM follows WHERE subscriber_id = $1 AND target_user_id = $2",
        [userId, id]
      );
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getRecomendUser(req, res) {
    const { userId } = req.params;
    try {
      const data = await pool.query("SELECT * from recomendusers($1)", [
        userId,
      ]);
      return res.json(data.rows);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async updateProfile(req, res) {
    const id = tokenService.returnPayload(req.cookies.token);
    const { name, nickname, description } = req.body;
    let updateQuery = "UPDATE users SET";
    const updateValues = [];
    const updateFields = [];
    if (req.files) {
      if (req.files.avatar) {
        console.log("oleg");
        await fileService.setFile(
          id,
          req.files.avatar[0],
          "users",
          "avatar_url"
        );
      }
      if (req.files.background) {
        await fileService.setFile(
          id,
          req.files.background[0],
          "users",
          "back_url"
        );
      }
    }
    if (description) {
      updateFields.push("description");
      updateValues.push(description);
    }

    if (name) {
      updateFields.push("name");
      updateValues.push(name);
    }

    if (nickname) {
      updateFields.push("nickname");
      updateValues.push(nickname);
    }

    updateQuery += ` ${updateFields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(",")} WHERE id = ${id}`;
    if (updateFields.length && updateValues.length) {
      await pool.query(updateQuery, updateValues);
    }
    const response = await pool.query("select * from users where id = $1", [
      id,
    ]);
    res.json(response.rows[0]);
  }
  async setPhoto(req, res) {
    const id = tokenService.returnPayload(req.cookies.token);
    const { type } = req.body;
    console.log(type);
    console.log(req.files);
    console.log(req.file);
    try {
      if (req.files) {
        const response = await fileService.setFile(
          id,
          req.files[type === "avatar_url" ? "avatar" : "background"][0],
          "users",
          type
        );
        res.json(response.rows[0]);
      } else res.json("nixau");
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async searchUsers(req, res) {
    try {
      const { query } = req.query;
      if (query.length) {
        const data = await pool.query(
          `SELECT nickname,avatar_url,id FROM users WHERE LOWER(nickname) LIKE '${query}%' OR LOWER(name) LIKE '${query}%'`
        );
        return res.json(data.rows);
      } else {
        return res.json([]);
      }
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
}
export default new userController();
