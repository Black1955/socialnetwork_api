import { Post } from '../../../domain/entities/Post.js';
import { PostRepo } from '../../../domain/interfaces/PostRepo.js';
import pool from '../../../configs/db.js';
export class PostRepoPostgre implements PostRepo {
  async getBlogPost(
    id: number,
    page: number,
    limit: number,
    myId: number
  ): Promise<Post[]> {
    const res = await pool.query<Post>(
      'select P.*, U.nickname, U.avatar_url from (SELECT * FROM blogposts($1,$2,$3,$4) ) as P inner join users U on P.user_id = U.id',
      [id, myId, limit, page]
    );
    return res.rows;
  }
  async getFollowingPost(
    id: number,
    page: number,
    limit: number
  ): Promise<Post[]> {
    const res = await pool.query<Post>(
      'select P.*, U.nickname, U.avatar_url from (SELECT * FROM followsposts($1,$2,$3) ) as P inner join users U on P.user_id = U.id',
      [id, limit, page]
    );
    return res.rows;
  }
  async getLikedPost(
    id: number,
    page: number,
    limit: number,
    myId: number
  ): Promise<Post[]> {
    const res = await pool.query<Post>(
      'select P.*, U.nickname, U.avatar_url from (SELECT * FROM likedPosts($1,$2,$3,$4) ) as P inner join users U on P.user_id = U.id',
      [id, myId, limit, page]
    );
    return res.rows;
  }
  async getNewPost(
    id: number,
    page: number,
    limit: number,
    myId: number
  ): Promise<Post[]> {
    const res = await pool.query<Post>(
      'select P.*, U.nickname, U.avatar_url from (SELECT * from newposts($1,$2,$3,$4) ) as P inner join users U on P.user_id = U.id',
      [id, myId, limit, page]
    );
    return res.rows;
  }
  async getPopularPost(
    id: number,
    page: number,
    limit: number,
    myId: number
  ): Promise<Post[]> {
    const res = await pool.query<Post>(
      'select P.*, U.nickname, U.avatar_url from (select * from popularblog($1,$2,$3)) as P inner join users U on P.user_id = U.id',
      [myId, limit, page]
    );
    return res.rows;
  }
  async create(
    title: string,
    description: string,
    user_id: number,
    url?: string
  ): Promise<Post> {
    try {
      const res = await pool.query<Post>(
        'INSERT INTO posts (title,description, user_id,img_url) values ($1,$2,$3,$4) RETURNING *',
        [title, description, user_id, url ? url : null]
      );
      return res.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('post hasn`t been created');
    }
  }
  async delete(id: number): Promise<boolean> {
    try {
      await pool.query('DELETE FROM posts WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getPosts(id: number): Promise<Post[]> {
    try {
      const res = await pool.query<Post>(
        'SELECT * FROM posts WHERE user_id = $1',
        [id]
      );
      console.log(res.rows);
      return res.rows;
    } catch (error) {
      console.log(error);
      throw new Error('');
    }
  }
  async getPost(id: number): Promise<Post> {
    try {
      const res = await pool.query<Post>('SELECT * FROM posts WHERE id = $1', [
        id,
      ]);
      return res.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('');
    }
  }
  async like(id: number, post_id: number): Promise<boolean> {
    try {
      await pool.query('INSERT INTO likes (user_id,post_id) values ($1,$2)'),
        [id, post_id];
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async dislike(id: number, post_id: number): Promise<boolean> {
    try {
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2 ',
        [id, post_id]
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getLikes(id: number): Promise<{ likes: number }> {
    try {
      const post = await pool.query<{ likes: number }>(
        'select count(*) as likes from likes where post_id = $1',
        [id]
      );
      return post.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('');
    }
  }
  getRecomend(): Promise<Post[]> {
    throw new Error('Method not implemented.');
  }
  change(): Promise<Post> {
    throw new Error('Method not implemented.');
  }
}
