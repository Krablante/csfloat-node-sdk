import type { CsfloatHttpClient } from "../client.js";
import type {
  AcceptTradesRequest,
  CounterOfferRequest,
  CsfloatAccountStandingResponse,
  CsfloatAutoBid,
  CsfloatBuyOrder,
  CsfloatBuyOrdersResponse,
  CsfloatCursorParams,
  CsfloatListingsResponse,
  CreateBuyOrderRequest,
  CsfloatMessageResponse,
  CsfloatMeResponse,
  CsfloatMobileStatusResponse,
  CsfloatNotificationsResponse,
  CsfloatNotaryTokenResponse,
  CsfloatOffer,
  CsfloatOffersResponse,
  CsfloatPageParams,
  CsfloatRecommenderTokenResponse,
  CsfloatTrade,
  CsfloatTradeBatchResponse,
  CsfloatTradeBuyerDetails,
  CsfloatTradesParams,
  CsfloatTradesResponse,
  CsfloatTransactionsResponse,
  CsfloatSimilarBuyOrdersResponse,
  CsfloatUpdateMeRequest,
  CreateOfferRequest,
  QueryParams,
  SimilarBuyOrdersRequest,
  UpdateBuyOrderRequest,
} from "../types.js";

export class AccountResource {
  constructor(private readonly client: CsfloatHttpClient) { }

  getMe(): Promise<CsfloatMeResponse> {
    return this.client.get<CsfloatMeResponse>("me");
  }

  getTrades(params: CsfloatTradesParams = {}): Promise<CsfloatTradesResponse> {
    return this.client.get<CsfloatTradesResponse>("me/trades", params as QueryParams);
  }

  getTrade(tradeId: string): Promise<CsfloatTrade> {
    return this.client.get<CsfloatTrade>(`trades/${tradeId}`);
  }

  getTradeBuyerDetails(tradeId: string): Promise<CsfloatTradeBuyerDetails> {
    return this.client.get<CsfloatTradeBuyerDetails>(`trades/${tradeId}/buyer-details`);
  }

  acceptTrades(tradeIds: string[] | AcceptTradesRequest): Promise<CsfloatTradeBatchResponse> {
    const body = Array.isArray(tradeIds)
      ? { trade_ids: tradeIds }
      : tradeIds;

    return this.client.post<CsfloatTradeBatchResponse>("trades/bulk/accept", body);
  }

  acceptTrade(tradeId: string): Promise<CsfloatTrade> {
    return this.client.post<CsfloatTrade>(`trades/${tradeId}/accept`, {});
  }

  acceptSale(tradeId: string): Promise<CsfloatTrade> {
    return this.acceptTrade(tradeId);
  }

  cancelTrades(tradeIds: string[] | AcceptTradesRequest): Promise<CsfloatTradeBatchResponse> {
    const body = Array.isArray(tradeIds)
      ? { trade_ids: tradeIds }
      : tradeIds;

    return this.client.post<CsfloatTradeBatchResponse>("trades/bulk/cancel", body);
  }

  cancelTrade(tradeId: string): Promise<CsfloatMessageResponse> {
    return this.client.delete<CsfloatMessageResponse>(`trades/${tradeId}`);
  }

  cancelSale(tradeId: string): Promise<CsfloatMessageResponse> {
    return this.cancelTrade(tradeId);
  }

  getOffers(params: CsfloatCursorParams = {}): Promise<CsfloatOffersResponse> {
    return this.client.get<CsfloatOffersResponse>("me/offers", params as QueryParams);
  }

  createOffer(request: CreateOfferRequest): Promise<CsfloatOffer> {
    return this.client.post<CsfloatOffer>("offers", request);
  }

  getOffer(offerId: string): Promise<CsfloatOffer> {
    return this.client.get<CsfloatOffer>(`offers/${offerId}`);
  }

  getOfferHistory(offerId: string): Promise<CsfloatOffer[]> {
    return this.client.get<CsfloatOffer[]>(`offers/${offerId}/history`);
  }

  counterOffer(offerId: string, request: CounterOfferRequest): Promise<CsfloatOffer> {
    return this.client.post<CsfloatOffer>(`offers/${offerId}/counter-offer`, request);
  }

  cancelOffer(offerId: string): Promise<CsfloatMessageResponse> {
    return this.client.delete<CsfloatMessageResponse>(`offers/${offerId}`);
  }

  declineOffer(offerId: string): Promise<CsfloatMessageResponse> {
    return this.cancelOffer(offerId);
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

  getSimilarBuyOrders(
    request: SimilarBuyOrdersRequest,
  ): Promise<CsfloatSimilarBuyOrdersResponse> {
    return this.client.post<CsfloatSimilarBuyOrdersResponse>(
      "buy-orders/similar-orders",
      request,
    );
  }

  createBuyOrder(request: CreateBuyOrderRequest): Promise<CsfloatBuyOrder> {
    return this.client.post<CsfloatBuyOrder>("buy-orders", {
      market_hash_name: request.market_hash_name,
      max_price: request.max_price,
      ...(request.quantity === undefined ? {} : { quantity: request.quantity }),
    });
  }

  updateBuyOrder(orderId: string, request: UpdateBuyOrderRequest): Promise<CsfloatBuyOrder> {
    return this.client.patch<CsfloatBuyOrder>(`buy-orders/${orderId}`, request);
  }

  deleteBuyOrder(orderId: string): Promise<CsfloatMessageResponse> {
    return this.client.delete<CsfloatMessageResponse>(`buy-orders/${orderId}`);
  }

  getAutoBids(): Promise<CsfloatAutoBid[]> {
    return this.client.get<CsfloatAutoBid[]>("me/auto-bids");
  }

  deleteAutoBid(autoBidId: string): Promise<CsfloatMessageResponse> {
    return this.client.delete<CsfloatMessageResponse>(`me/auto-bids/${autoBidId}`);
  }

  createRecommenderToken(): Promise<CsfloatRecommenderTokenResponse> {
    return this.client.post<CsfloatRecommenderTokenResponse>("me/recommender-token", {});
  }

  createNotaryToken(): Promise<CsfloatNotaryTokenResponse> {
    return this.client.post<CsfloatNotaryTokenResponse>("me/notary-token", {});
  }

  getMobileStatus(): Promise<CsfloatMobileStatusResponse> {
    return this.client.get<CsfloatMobileStatusResponse>("me/mobile/status");
  }

  updateMe(request: CsfloatUpdateMeRequest): Promise<CsfloatMessageResponse> {
    return this.client.patch<CsfloatMessageResponse>("me", request);
  }

  setOffersEnabled(enabled: boolean): Promise<CsfloatMessageResponse> {
    return this.updateMe({ offers_enabled: enabled });
  }

  setStallPublic(isPublic: boolean): Promise<CsfloatMessageResponse> {
    return this.updateMe({ stall_public: isPublic });
  }

  setAway(isAway: boolean): Promise<CsfloatMessageResponse> {
    return this.updateMe({ away: isAway });
  }

  setMaxOfferDiscount(maxOfferDiscount: number): Promise<CsfloatMessageResponse> {
    return this.updateMe({ max_offer_discount: maxOfferDiscount });
  }

  updateTradeUrl(tradeUrl: string): Promise<CsfloatMessageResponse> {
    return this.updateMe({ trade_url: tradeUrl });
  }

  /**
   * Update the profile background image URL.
   * Live-confirmed accepted by PATCH /me (2026-03-07 research pass).
   */
  updateBackground(backgroundUrl: string): Promise<CsfloatMessageResponse> {
    return this.updateMe({ background_url: backgroundUrl });
  }

  /**
   * Update the display username.
   * Live-confirmed accepted by PATCH /me (2026-03-07 research pass).
   * Note: exact validation rules not fully documented; handle errors from the API accordingly.
   */
  updateUsername(username: string): Promise<CsfloatMessageResponse> {
    return this.updateMe({ username });
  }

  markNotificationsRead(lastReadId: string): Promise<CsfloatMessageResponse> {
    return this.client.post<CsfloatMessageResponse>("me/notifications/read-receipt", {
      last_read_id: lastReadId,
    });
  }

  setMobileStatus(version = "8.0.0"): Promise<CsfloatMessageResponse> {
    return this.client.post<CsfloatMessageResponse>("me/mobile/status", {
      version,
    });
  }
}
