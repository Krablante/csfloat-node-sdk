import type { CsfloatHttpClient } from "../client.js";
import type {
  CsfloatAccountStandingResponse,
  CsfloatAutoBid,
  CsfloatBuyOrdersResponse,
  CsfloatCursorParams,
  CsfloatListingsResponse,
  CsfloatMeResponse,
  CsfloatMobileStatusResponse,
  CsfloatNotificationsResponse,
  CsfloatOffersResponse,
  CsfloatPageParams,
  CsfloatTradesResponse,
  CsfloatTransactionsResponse,
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

  getOffersTimeline(params: Pick<CsfloatPageParams, "limit"> = {}): Promise<CsfloatOffersResponse> {
    return this.client.get<CsfloatOffersResponse>("me/offers-timeline", params as QueryParams);
  }

  getNotifications(): Promise<CsfloatNotificationsResponse> {
    return this.client.get<CsfloatNotificationsResponse>("me/notifications/timeline");
  }

  getTransactions(params: CsfloatPageParams = {}): Promise<CsfloatTransactionsResponse> {
    return this.client.get<CsfloatTransactionsResponse>("me/transactions", params as QueryParams);
  }

  getAccountStanding(): Promise<CsfloatAccountStandingResponse> {
    return this.client.get<CsfloatAccountStandingResponse>("me/account-standing");
  }

  getBuyOrders(params: CsfloatPageParams = {}): Promise<CsfloatBuyOrdersResponse> {
    return this.client.get<CsfloatBuyOrdersResponse>("me/buy-orders", params as QueryParams);
  }

  getAutoBids(): Promise<CsfloatAutoBid[]> {
    return this.client.get<CsfloatAutoBid[]>("me/auto-bids");
  }

  getMobileStatus(): Promise<CsfloatMobileStatusResponse> {
    return this.client.get<CsfloatMobileStatusResponse>("me/mobile/status");
  }
}
