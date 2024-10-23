import bccrypt from 'bcrypt';
import { RepositoryFactory } from '../factory/RepositoryFactory';
import { FileService } from './FileSerivce';

export class UserService {
  private UserRepo;
  private FileService;
  private constructor(
    RepositoryFactory: RepositoryFactory,
    fileService: FileService
  ) {
    this.UserRepo = RepositoryFactory.CreateUserRepository();
    this.FileService = fileService;
  }
  public static getInstance(
    RepositoryFactory: RepositoryFactory,
    fileService: FileService
  ) {
    return new UserService(RepositoryFactory, fileService);
  }
  async create(email: string, password: string, nickname: string) {
    try {
      return await this.UserRepo.create(email, password, nickname);
    } catch (error) {
      throw error;
    }
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
  async setAvatar() {}
}
