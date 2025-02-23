export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}
