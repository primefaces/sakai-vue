import { HttpService } from '@/shared/services/Http';

export class LoginService extends HttpService {
  private static _instance: LoginService;

  constructor() {
    // @ts-ignore
    super(import.meta.env.VITE_BASE_ENDPOINT);
  }

  static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new LoginService();

    return this._instance;
  }

  async login(username: string, password: string): Promise<any> {
    const resp = await this.post<any>(`auth/`, { username, password }, false);
    this.setToken(resp.data.token);
    return resp;
  }

  async logout(): Promise<void> {
    this.removeTokens();
  }
}
