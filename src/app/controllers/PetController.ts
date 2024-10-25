import { TokenService } from './../services/TokenService.js';
import { Request, Response } from 'express';
import pool from '../../configs/db.js';

export class PetController {
  constructor(private tokenService: TokenService) {
    this.createPet = this.createPet.bind(this);
    this.getPets = this.getPets.bind(this);
  }

  async createPet(req: Request, res: Response) {
    const id = this.tokenService.returnPayload(req.headers.authorization!);
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
