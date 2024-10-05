import { UserRepo } from '../../../domain/interfaces/UserRepo';
import pool from '../../../configs/db';
import { User } from '../../../domain/entities/User';
export class UserRepoPostgre implements UserRepo {
  async create(
    email: string,
    password: string,
    nickname: string
  ): Promise<User> {
    try {
      const res = await pool.query<User>(
        'INSERT INTO users (email,password,nickname) VALUES ($1,$2,$3) RETURNING *',
        [email, password, nickname]
      );
      return res.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }
  async delete(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const data = await pool.query<User>(
        'SELECT id, nickname, name, description, followers, following, avatar_url, back_url, email FROM users WHERE email = $1',
        [email]
      );
      return data.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('there is no user with this email');
    }
  }
  async findById(id: number): Promise<User> {
    try {
      const data = await pool.query<User>(
        'SELECT id, nickname, name, description, followers, following, avatar_url, back_url, email FROM users WHERE id = $1',
        [id]
      );
      return data.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('there is no user');
    }
  }
  async search(query: string): Promise<User> {
    if (!query.length) {
      throw new Error('query is ampty');
    } else {
      try {
        const data = await pool.query<User>(
          `SELECT nickname,avatar_url,id FROM users WHERE LOWER(nickname) LIKE '${query}%' OR LOWER(name) LIKE '${query}%'`
        );
        return data.rows[0];
      } catch (error) {
        console.log(error);
        throw new Error('there is no user');
      }
    }
  }
  update(): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async isSybscribed(myId: number, user_id: number) {
    try {
      const data = await pool.query<{ subscribed: boolean }>(
        'SELECT EXISTS (SELECT * FROM follows WHERE subscriber_id = $1 and target_user_id = $2) AS subscribed',
        [myId, user_id]
      );
      return data.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('');
    }
  }
  async subscribe(myId: number, userId: number): Promise<boolean> {
    try {
      await pool.query(
        'INSERT INTO follows (subscriber_id,target_user_id) values ($1,$2)',
        [myId, userId]
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async unSubscribe(myId: number, userId: number): Promise<boolean> {
    try {
      await pool.query(
        'DELETE FROM follows WHERE subscriber_id = $1 AND target_user_id = $2',
        [myId, userId]
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async recomend(id: number): Promise<User[]> {
    try {
      const users = await pool.query<User[]>(
        'SELECT * from recomendusers($1)',
        [id]
      );
      return users.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('');
    }
  }
}
