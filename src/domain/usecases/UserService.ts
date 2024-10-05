import bccrypt from 'bcrypt';
import { RepositoryFactory } from '../factory/RepositoryFactory';

export class UserService {
  private UserRepo;
  private constructor(RepositoryFactory: RepositoryFactory) {
    this.UserRepo = RepositoryFactory.CreateUserRepository();
  }
  public static getInstance(RepositoryFactory: RepositoryFactory) {
    return new UserService(RepositoryFactory);
  }
  async create(email: string, password: string, nickname: string) {
    try {
      return await this.UserRepo.create(email, password, nickname);
    } catch (error) {}
  }
  async isSubscribed(myId: number, user_id: number) {
    try {
      return await this.UserRepo.isSybscribed(myId, user_id);
    } catch (error) {}
  }
  async delete(id: number) {
    try {
      return await this.UserRepo.delete(id);
    } catch (error) {}
  }

  async findById(id: number) {
    try {
      return await this.UserRepo.findById(id);
    } catch (error) {}
  }
  async findByEmail(email: string) {
    try {
      return await this.UserRepo.findByEmail(email);
    } catch (error) {}
  }
  async search(query: string) {
    try {
      return await this.UserRepo.search(query);
    } catch (error) {}
  }
  async validate(email: string, password: string) {
    const user = await this.UserRepo.findByEmail(email);

    if (user.password.length < 0) {
      throw new Error('incorrect email or password');
    }
    const isPasswordValid = bccrypt.compareSync(
      password.toString(),
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('incorrect email or password');
    }
    return user;
  }
  async subcsribe(myId: number, userId: number) {
    return this.UserRepo.subscribe(myId, userId);
  }
  async unsubcsribe(myId: number, userId: number) {
    return this.UserRepo.unSubscribe(myId, userId);
  }
  async recomend(myId: number) {
    return this.UserRepo.recomend(myId);
  }
}
