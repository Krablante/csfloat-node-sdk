import type { CsfloatHttpClient } from "../client.js";
import type { CsfloatListingsResponse, QueryParams } from "../types.js";

export interface GetStallParams {
  limit?: number;
  cursor?: string;
}

export class StallResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getStall(userId: string, params: GetStallParams = {}): Promise<CsfloatListingsResponse> {
    return this.client.get<CsfloatListingsResponse>(
      `users/${userId}/stall`,
      params as QueryParams,
    );
  }
}
