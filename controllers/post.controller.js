import pool from "../db.js";
import tokenService from "../services/token.service.js";
import "dotenv/config.js";
class PostContorller {
  async getUserPosts(req, res) {
    const id = req.query.id;
    try {
      const data = await pool.query("SELECT * FROM posts WHERE user_id = $1", [
        id,
      ]);
      if (!data.rows.length) {
        res.json("this user doesn`t have any posts");
        return;
      }
      res.json(data.rows);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  async CreateuserPost(req, res) {
    const id = tokenService.returnPayload(req.headers.authorization);
    const { title, description } = req.body;
    const file = req.file ? req.file.path : null;
    try {
      const data = await pool.query(
        "INSERT INTO posts (title,description, user_id,img_url) values ($1,$2,$3,$4) RETURNING *",
        [title, description, id, file]
      );
      if (!data.rows.length) {
        res.json("this user doesn`t have any posts");
        return;
      }
      res.json(data.rows);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  }
  async getRecomendedPosts(req, res) {
    try {
      const { id } = req.params;
      const myId = tokenService.returnPayload(req.headers.authorization);
      const { page, limit, type } = req.query;
      let data;
      switch (type) {
        case "following":
          data = await pool.query("SELECT * FROM followsposts($1,$2,$3)", [
            id,
            limit,
            page,
          ]);
          return res.json(data.rows);
        case "liked":
          data = await pool.query("SELECT * FROM likedPosts($1,$2,$3,$4)", [
            id,
            myId,
            limit,
            page,
          ]);
          return res.json(data.rows);
        case "popular":
          data = await pool.query("select * from popularblog($1,$2,$3)", [
            myId,
            limit,
            page,
          ]);
          return res.json(data.rows);
        case "new":
          data = await pool.query("SELECT * from newposts($1,$2,$3,$4)", [
            id,
            myId,
            limit,
            page,
          ]);
          return res.json(data.rows);
        case "blog":
          data = await pool.query("SELECT * FROM blogposts($1,$2,$3,$4)", [
            id,
            myId,
            limit,
            page,
          ]);
          return res.json(data.rows);
        default:
          return res.json({ massage: "incorrect type of query" });
      }
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async likePost(req, res) {
    const id = tokenService.returnPayload(req.headers.authorization);
    const { post_id } = req.body;
    try {
      await pool.query("INSERT INTO likes (user_id,post_id) values ($1,$2)", [
        id,
        post_id,
      ]);
      const post = await pool.query(
        "select count(*) as likes from likes where post_id = $1",
        [post_id]
      );
      return res.json(post.rows[0]);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async dislikePost(req, res) {
    const id = tokenService.returnPayload(req.headers.authorization);
    const { post_id } = req.body;
    try {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND post_id = $2 ",
        [id, post_id]
      );
      const post = await pool.query(
        "select count(*) as likes from likes where post_id = $1",
        [post_id]
      );
      return res.json(post.rows[0]);
    } catch (error) {
      return res.json(error);
    }
  }
  async upload(req, res) {
    return res.json(req.files);
  }
}

export default new PostContorller();
