import type { CsfloatHttpClient } from "../client.js";
import type { CsfloatUser } from "../types.js";

export class UsersResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getUser(userId: string): Promise<CsfloatUser> {
    return this.client.get<CsfloatUser>(`users/${userId}`);
  }
}
