import { Request, Response } from 'express';
import pool from '../../configs/db.js';
import tokenService from '../services/token.service.js';

class petController {
  async createPet(req: Request, res: Response) {
    const id = tokenService.returnPayload(req.headers.authorization!);
    let path = null;
    try {
      const { name } = req.body;
      if (req.files) {
        path = req.files.path;
      }
      const data = await pool.query(
        'INSERT INTO pets (name,img_url,user_id) values($1,$2,$3) RETURNING *',
        [name, path, id]
      );
      return res.json(data.rows[0]);
    } catch (error) {
      console.log(error);
      return res.json({ error: 'server error' });
    }
  }
  async getPets(req: Request, res: Response) {
    const { id, limit, page } = req.query;
    try {
      const pets = await pool.query(
        'SELECT * FROM pets where user_id = $1 limit $2 offset $3',
        [id, limit, page]
      );
      return res.json(pets.rows);
    } catch (error) {
      console.log(error);
      return res.json({ error: 'server error' });
    }
  }
}

export default new petController();
