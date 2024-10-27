import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import { ApiError } from '../services/ErrorService.js';
import { TokenService } from '../services/TokenService.js';

export class AuthController {
  constructor(
    private AuthService: AuthService,
    private tokenService: TokenService
  ) {
    this.signup = this.signup.bind(this);
    this.refresh = this.refresh.bind(this);
    this.signin = this.signin.bind(this);
  }

  public async signup(req: Request, res: Response, next: NextFunction) {
    const { password, email, nickname } = req.body;
    try {
      const token = await this.AuthService.signup(password, email, nickname);
      console.log('AuthController signup token', token);
      return res.json({ access: true, token });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      } else {
        return next(ApiError.Internal('An unexpected error occurred'));
      }
    }
  }
  public async signin(req: Request, res: Response, next: NextFunction) {
    const { password, email } = req.body;
    try {
      const token = await this.AuthService.signin(password, email);
      return res.json({ access: true, token });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      } else {
        return next(ApiError.Internal('An unexpected error occurred'));
      }
    }
  }
  public async refresh(req: Request, res: Response, next: NextFunction) {
    const id = this.tokenService.returnPayload(req.headers.authorization!);
    try {
      const response = await this.AuthService.refresh(id);
      res.json(response);
    } catch (error) {
      if (error instanceof ApiError) next(ApiError.BadRequest(error.message));
    }
  }
}
