export interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  userData: User;
  token: string;
}