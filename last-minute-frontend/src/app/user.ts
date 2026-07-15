export interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}