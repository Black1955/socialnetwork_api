export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  description: string;
  avatar_url: string;
  back_url: string;
  followers: number;
  following: number;
}
