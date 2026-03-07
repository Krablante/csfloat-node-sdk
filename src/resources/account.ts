import type { CsfloatHttpClient } from "../client.js";
import type { CsfloatMeResponse } from "../types.js";

export class AccountResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getMe(): Promise<CsfloatMeResponse> {
    return this.client.get<CsfloatMeResponse>("me");
  }
}
