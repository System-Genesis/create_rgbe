import { token } from '../../auth/spike';

export class tokenWrap {
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
