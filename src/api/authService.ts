import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const USERS_KEY = 'users';

class AuthService {
  private static instance: AuthService;

  private constructor() {
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<User> {
    const { identifier, password } = credentials;
    const users = this.getUsers();
    
    const user = users.find(
      (u) => (u.email === identifier || u.phone === identifier) && u.password === password
    );

    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // Store user data
    this.setUser(user);
    this.setToken(this.generateToken());

    return user;
  }

  public async register(credentials: RegisterCredentials): Promise<User> {
    const { email, password, name, phone } = credentials;
    const users = this.getUsers();

    // Check if email is already registered
    if (users.some((u) => u.email === email)) {
      throw new Error('该邮箱已被注册');
    }

    // Check if phone is already registered
    if (phone && users.some((u) => u.phone === phone)) {
      throw new Error('该手机号已被注册');
    }

    // Create new user
    const newUser: User = {
      id: this.generateUserId(),
      email,
      name,
      phone,
      password, // In a real app, you would hash the password
    };

    // Add user to storage
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Log user in
    this.setUser(newUser);
    this.setToken(this.generateToken());

    return newUser;
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUsers(): User[] {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateUserId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export const authService = AuthService.getInstance();
