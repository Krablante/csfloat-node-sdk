import type { CsfloatHttpClient } from "../client.js";
import { paginateCursor } from "../pagination.js";
import type {
  CsfloatListing,
  CsfloatListingsResponse,
  CsfloatStallParams,
  QueryParams,
} from "../types.js";

export type GetStallParams = CsfloatStallParams;

export class StallResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getStall(userId: string, params: GetStallParams = {}): Promise<CsfloatListingsResponse> {
    return this.client.get<CsfloatListingsResponse>(
      `users/${userId}/stall`,
      params as QueryParams,
    );
  }

  iterateStall(userId: string, params: Omit<GetStallParams, "cursor"> = {}) {
    return paginateCursor<CsfloatListingsResponse, CsfloatListing>({
      loadPage: (cursor) =>
        this.getStall(
          userId,
          cursor === undefined ? { ...params } : { ...params, cursor },
        ),
      getItems: (page) => page.data,
    });
  }
}
