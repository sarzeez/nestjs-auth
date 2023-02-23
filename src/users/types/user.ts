export interface CreateUserDetails {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  role: string;
}
