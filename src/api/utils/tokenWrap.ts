import { token } from '../../auth/spike';

// TODO: refactor tokenWrap or use other spike library to avoid redis clients
class tokenWrap {
  token?: string;

  constructor() {}

  async getToken(expired: Boolean): Promise<string> {
    if (expired) {
      this.token = await token()!();
      return this.token;
    } else if (!this.token) {
      this.token = await token()!();
      return this.token;
    } else {
      return this.token;
    }
  }
}
export const tokenWrapIns = new tokenWrap();
