import { UserService } from './../../domain/usecases/UserService.js';
import { ApiError } from './ErrorService.js';
import { TokenService } from './TokenService.js';
import bccrypt from 'bcrypt';
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}
  public async signin(password: string, email: string) {
    try {
      const user = await this.userService.validate(email, password);
      const token = this.tokenService.createToken(String(user.id));
      return token;
    } catch (error) {
      throw ApiError.BadRequest("'uncorrect password or email'");
    }
  }
  public async signup(password: string, email: string, nickname: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new ApiError(400, 'the user already exists');
    }
    const newpassword = await bccrypt.hash(password, 5);
    const newUser = await this.userService.create(email, newpassword, nickname);
    const token = this.tokenService.createToken(String(newUser?.id));
    return token;
  }
  public async refresh(id: string) {
    try {
      const user = await this.userService.findById(+id);
      const token = this.tokenService.createToken(id);
      return { user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
