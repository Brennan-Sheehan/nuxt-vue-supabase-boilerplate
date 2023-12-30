export interface User {
  name: string;
  email: string;
  avatar: string;
  token: string;
  refreshToken: string;
  expiresAt: number;
}