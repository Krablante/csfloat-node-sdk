import type { CsfloatHttpClient } from "../client.js";
import type {
  CsfloatCursorParams,
  CsfloatListingsResponse,
  CsfloatMeResponse,
  CsfloatOffersResponse,
  CsfloatTradesResponse,
  QueryParams,
} from "../types.js";

export class AccountResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getMe(): Promise<CsfloatMeResponse> {
    return this.client.get<CsfloatMeResponse>("me");
  }

  getTrades(params: CsfloatCursorParams = {}): Promise<CsfloatTradesResponse> {
    return this.client.get<CsfloatTradesResponse>("me/trades", params as QueryParams);
  }

  getOffers(params: CsfloatCursorParams = {}): Promise<CsfloatOffersResponse> {
    return this.client.get<CsfloatOffersResponse>("me/offers", params as QueryParams);
  }

  getWatchlist(
    params: Pick<CsfloatCursorParams, "cursor" | "limit"> = {},
  ): Promise<CsfloatListingsResponse> {
    return this.client.get<CsfloatListingsResponse>("me/watchlist", params as QueryParams);
  }
}
