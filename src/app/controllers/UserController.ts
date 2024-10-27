import { TokenService } from '../services/TokenService.js';
import { UserService } from '../../domain/usecases/UserService.js';
import { ApiError } from '../services/ErrorService.js';
import { NextFunction, Request, Response } from 'express';
import { UserResponseDTO } from '../DTO/UserResponseDTO.js';
export class UserController {
  private UserService;
  private tokenService;
  private constructor(UserService: UserService, tokenService: TokenService) {
    this.UserService = UserService;
    this.tokenService = tokenService;

    this.SubscribeUser = this.SubscribeUser.bind(this);
    this.getRecomendUser = this.getRecomendUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
    this.unSubscribeUser = this.unSubscribeUser.bind(this);
  }
  public static getInstance(
    UserService: UserService,
    tokenService: TokenService
  ): UserController {
    return new UserController(UserService, tokenService);
  }
  async getUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;
    try {
      const user = await this.UserService.findById(Number(userId));
      if (!user) {
        res.json({ error: 'user doesn`t exist' });
        return;
      }
      const id = user.id;
      const jwtid = this.tokenService.returnPayload(req.headers.authorization!);
      const checkfollow = await this.UserService.isSubscribed(jwtid, id);
      const response = new UserResponseDTO(user, checkfollow?.subscribed!);
      res.locals.apiResponse = response;
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  async SubscribeUser(req: Request, res: Response) {
    const { id } = req.body;
    const userId = this.tokenService.returnPayload(req.headers.authorization!);
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
    const userId = this.tokenService.returnPayload(req.headers.authorization!);
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
      console.log(users);
      return res.json(users);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  async searchUsers(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (query && query.length) {
        const users = await this.UserService.search(String(query));
        return res.json(users);
      } else {
        return res.json([]);
      }
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
  // async updateProfile(req: Request, res: Response) {
  //   const id = this.tokenService.returnPayload(req.headers.authorization!);
  //   const { name, nickname, description } = req.body;
  //   let updateQuery = 'UPDATE users SET';
  //   const updateValues = [];
  //   const updateFields = [];
  //   if (req.files) {
  //     if (req.files.avatar) {
  //       const file = Array.isArray(req.files.avatar)
  //         ? req.files.avatar[0]
  //         : req.files.avatar;
  //       await this.fileService.setFile(
  //         id,
  //         file as UploadedFile,
  //         'users',
  //         'avatar_url'
  //       );
  //     }
  //     if (req.files.background) {
  //       const file = Array.isArray(req.files.background)
  //         ? req.files.background[0]
  //         : req.files.background;
  //       await fileService.setFile(id, file, 'users', 'back_url');
  //     }
  //   }
  //   if (description) {
  //     updateFields.push('description');
  //     updateValues.push(description);
  //   }

  //   if (name) {
  //     updateFields.push('name');
  //     updateValues.push(name);
  //   }

  //   if (nickname) {
  //     updateFields.push('nickname');
  //     updateValues.push(nickname);
  //   }

  //   updateQuery += ` ${updateFields
  //     .map((field, index) => `${field} = $${index + 1}`)
  //     .join(',')} WHERE id = ${id}`;
  //   if (updateFields.length && updateValues.length) {
  //     await pool.query(updateQuery, updateValues);
  //   }
  //   const response = await pool.query('select * from users where id = $1', [
  //     id,
  //   ]);
  //   res.json(response.rows[0]);
  // }
  // async setPhoto(req: Request, res: Response) {
  //   const id = this.tokenService.returnPayload(req.headers.authorization!);
  //   const { type } = req.body;
  //   try {
  //     if (req.files) {
  //       const file = req.files[type === 'avatar_url' ? 'avatar' : 'background'];
  //       const FILE = Array.isArray(file) ? file[0] : file;
  //       const user = await this.UserService.findById(id);
  //       if (type === 'avatar_url') {
  //         if (user?.avatar_url) {
  //           const fileResponse = await this.FileService.update(
  //             user.avatar_url,
  //             FILE
  //           );
  //           res.json({ avatar_url: fileResponse.path });
  //           return;
  //         } else {
  //           if (user?.back_url) {
  //             const fileResponse = await this.FileService.update(
  //               user.back_url,
  //               FILE
  //             );
  //             res.json({ back_url: fileResponse.path });
  //           }
  //         }
  //       } else {
  //         const fileResponse = await this.FileService.upload(file);
  //       }
  //       res.json(response.rows[0]);
  //     } else res.json('there are no files');
  //   } catch (error) {
  //     console.log(error);
  //     return res.json(error);
  //   }
  // }
}
