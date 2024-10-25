import { User } from '../entities/User.js';

export interface UserRepo {
  create(email: string, password: string, nickname: string): Promise<User>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  delete(id: number): Promise<boolean>;
  update(id: number): Promise<User>;
  search(query: string): Promise<User[]>;
  isSybscribed(myId: number, user_id: number): Promise<{ subscribed: boolean }>;
  subscribe(myId: number, userId: number): Promise<boolean>;
  unSubscribe(myId: number, userId: number): Promise<boolean>;
  recomend(id: number): Promise<User[]>;
}
