import { UserService } from './../services/UserService';
import pool from '../../configs/db.js';
import bccrypt from 'bcrypt';
import tokenService from '../services/token.service.js';
import fileService from '../services/fileService/file.service.js';
import { ApiError } from '../services/error.service.js';
import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
export class UserController {
  UserService;
  FileService;
  private constructor(
    UserService: UserService,
    FileService: typeof fileService
  ) {
    this.UserService = UserService;
    this.FileService = FileService;
  }
  public static getInstance(
    UserService: UserService,
    FileService: typeof fileService
  ): UserController {
    return new UserController(UserService, FileService);
  }
  async signin(req: Request, res: Response, next: NextFunction) {
    const { password, email } = req.body;
    try {
      const user = await this.UserService.validate(email, password);
      const token = tokenService.createToken(String(user.id));
      // res.cookie("token", token, {
      //   httpOnly: true,
      // });
      return res.json({ access: true, token });
    } catch (error) {
      console.log(error);
      next(ApiError.BadRequest('uncorrect password or email'));
    }
  }
  async signup(req: Request, res: Response, next: NextFunction) {
    const { password, email, nickname } = req.body;
    try {
      const user = await this.UserService.findByEmail(email);
      if (user) {
        next(ApiError.BadRequest('the user is already existed'));
      } else {
        const newpassword = await bccrypt.hash(password, 5);
        const newUser = await this.UserService.create(
          email,
          newpassword,
          nickname
        );
        const token = tokenService.createToken(String(newUser?.id));
        return res.json({ access: true, token });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) next(ApiError.BadRequest(error.message));
    }
  }
  async refresch(req: Request, res: Response, next: NextFunction) {
    const id = tokenService.returnPayload(req.headers.authorization!);
    try {
      const user = await this.UserService.findById(id);
      const token = tokenService.createToken(id);
      const { policy, signature } = fileService.genereateSycret();
      return res.json({ user, token, policy, signature });
    } catch (error) {
      if (error instanceof ApiError) next(ApiError.BadRequest(error.message));
    }
  }
  async getUser(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const user = await this.UserService.findById(Number(userId));
      if (!user) {
        res.json({ error: 'user doesn`t exist' });
        return;
      }
      const id = user.id;
      const jwtid = tokenService.returnPayload(req.headers.authorization!);
      const checkfollow = await this.UserService.isSubscribed(jwtid, id);
      res.json({ ...user, ...checkfollow });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
  async SubscribeUser(req: Request, res: Response) {
    const { id } = req.body;
    const userId = tokenService.returnPayload(req.headers.authorization!);
    try {
      await this.UserService.subcsribe(userId, id);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async unSubscribeUser(req: Request, res: Response) {
    const { id } = req.body;
    const userId = tokenService.returnPayload(req.headers.authorization!);
    try {
      await this.UserService.unsubcsribe(userId, id);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async getRecomendUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const users = await this.UserService.recomend(+userId);
      return res.json(users);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async updateProfile(req: Request, res: Response) {
    const id = tokenService.returnPayload(req.headers.authorization!);
    const { name, nickname, description } = req.body;
    let updateQuery = 'UPDATE users SET';
    const updateValues = [];
    const updateFields = [];
    if (req.files) {
      if (req.files.avatar) {
        const file = Array.isArray(req.files.avatar)
          ? req.files.avatar[0]
          : req.files.avatar;
        await fileService.setFile(
          id,
          file as UploadedFile,
          'users',
          'avatar_url'
        );
      }
      if (req.files.background) {
        const file = Array.isArray(req.files.background)
          ? req.files.background[0]
          : req.files.background;
        await fileService.setFile(id, file, 'users', 'back_url');
      }
    }
    if (description) {
      updateFields.push('description');
      updateValues.push(description);
    }

    if (name) {
      updateFields.push('name');
      updateValues.push(name);
    }

    if (nickname) {
      updateFields.push('nickname');
      updateValues.push(nickname);
    }

    updateQuery += ` ${updateFields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(',')} WHERE id = ${id}`;
    if (updateFields.length && updateValues.length) {
      await pool.query(updateQuery, updateValues);
    }
    const response = await pool.query('select * from users where id = $1', [
      id,
    ]);
    res.json(response.rows[0]);
  }
  async setPhoto(req: Request, res: Response) {
    const id = tokenService.returnPayload(req.headers.authorization!);
    const { type } = req.body;
    try {
      if (req.files) {
        const file = req.files[type === 'avatar_url' ? 'avatar' : 'background'];
        const singleFile = Array.isArray(file) ? file[0] : file;
        const response = await fileService.setFile(
          id,
          singleFile,
          'users',
          type
        );
        res.json(response.rows[0]);
      } else res.json('nixau');
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async searchUsers(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (query && query.length) {
        const users = this.UserService.search(String(query));
        return res.json(users);
      } else {
        return res.json([]);
      }
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
}
