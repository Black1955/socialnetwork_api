import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiError } from '../services/ErrorService';
import { TokenService } from '../services/TokenService';

export class AuthController {
  constructor(
    private AuthService: AuthService,
    private tokenService: TokenService
  ) {}

  public async signup(req: Request, res: Response, next: NextFunction) {
    const { password, email, nickname } = req.body;
    try {
      const token = await this.AuthService.signup(password, email, nickname);
      return { access: true, token };
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
      return { access: true, token };
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
