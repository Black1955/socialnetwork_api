import { User } from '../../domain/entities/User';

export class UserResponseDTO {
  private user: User;
  private subscribed: boolean;

  constructor(user: User, subscribed: boolean) {
    this.user = user;
    this.subscribed = subscribed;
  }
  getUser() {
    return this.user;
  }
  setUser(user: User) {
    this.user = user;
  }
  getObject() {
    return { user: this.user, subscribed: this.subscribed };
  }
}
