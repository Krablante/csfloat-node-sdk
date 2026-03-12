import type { CsfloatHttpClient } from "../client.js";
import { paginateCursor } from "../pagination.js";
import type {
  AcceptTradesRequest,
  CounterOfferRequest,
  CsfloatAcceptOfferResponse,
  CsfloatAccountStandingResponse,
  CsfloatAutoBid,
  CsfloatBuyOrder,
  CsfloatBuyOrdersParams,
  CsfloatBuyOrdersResponse,
  CsfloatExtensionStatusResponse,
  CsfloatGsInspectTokenResponse,
  CsfloatInspectBuyOrdersResponse,
  CsfloatListing,
  CsfloatListingsResponse,
  CsfloatMaxWithdrawableResponse,
  CreateBuyOrderRequest,
  CsfloatMessageResponse,
  CsfloatMeResponse,
  CsfloatMobileStatusResponse,
  CsfloatNotificationsResponse,
  CsfloatNotificationsParams,
  CsfloatNotaryTokenResponse,
  CsfloatOffer,
  CsfloatOffersParams,
  CsfloatOffersResponse,
  CsfloatPageParams,
  CsfloatPendingDeposit,
  CsfloatPendingWithdrawal,
  CsfloatRecommenderTokenResponse,
  CsfloatTrade,
  CsfloatTradeActionResponse,
  CsfloatTradeBatchResponse,
  CsfloatTradeBuyerDetails,
  CsfloatTradeSteamOfferSyncRequest,
  CsfloatTradeSteamStatusNewOfferRequest,
  CsfloatTradesParams,
  CsfloatTradesResponse,
  CsfloatTransactionsParams,
  CsfloatTransactionsResponse,
  CsfloatSimilarBuyOrdersResponse,
  CsfloatUpdateMeRequest,
  CsfloatVerifyEmailRequest,
  CsfloatVerifySmsRequest,
  CsfloatWatchlistParams,
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

  /**
   * Low-level seller-side failure helper for the browser-confirmed cannot-deliver route.
   * State gating and happy-path semantics remain trade-specific, so keep this as an advanced helper.
   */
  cannotDeliverTrade(tradeId: string): Promise<CsfloatTradeActionResponse> {
    return this.client.post<CsfloatTradeActionResponse>(`trades/${tradeId}/cannot-deliver`, {});
  }

  /**
   * Low-level buyer/seller dispute helper for the browser-confirmed trade dispute route.
   * Route existence and no-body payload are confirmed from the current frontend bundle.
   */
  disputeTrade(tradeId: string): Promise<CsfloatTradeActionResponse> {
    return this.client.post<CsfloatTradeActionResponse>(`trades/${tradeId}/dispute`, {});
  }

  /**
   * Low-level Steam-offer sync helper for the browser-observed new-offer route.
   * Current live validation confirms `{ offer_id } -> 200 {"message":"successfully updated offer state" }`
   * even for `"0"`, and the current frontend also sends optional `{ given_asset_ids, received_asset_ids }`
   * arrays when it wants to annotate the offer against concrete assets.
   */
  syncSteamNewOffer(
    offerId: string | number | CsfloatTradeSteamStatusNewOfferRequest,
  ): Promise<CsfloatMessageResponse> {
    const body = typeof offerId === "string" || typeof offerId === "number"
      ? { offer_id: String(offerId) }
      : offerId;

    return this.client.post<CsfloatMessageResponse>("trades/steam-status/new-offer", body);
  }

  /**
   * Low-level Steam-offer sync helper for the browser-observed offer-status route.
   * Current live validation confirms `{ sent_offers: [] }` and `{ trade_id, sent_offers: [] }`
   * return `200 {"message":"successfully updated offer state" }`.
   */
  syncSteamOffers(
    request: CsfloatTradeSteamOfferSyncRequest,
  ): Promise<CsfloatMessageResponse> {
    return this.client.post<CsfloatMessageResponse>("trades/steam-status/offer", request);
  }

  acceptTrades(tradeIds: string[] | AcceptTradesRequest): Promise<CsfloatTradeBatchResponse> {
    const body = Array.isArray(tradeIds)
      ? { trade_ids: tradeIds }
      : tradeIds;

    return this.client.post<CsfloatTradeBatchResponse>("trades/bulk/accept", body);
  }

  markTradesReceived(tradeIds: string[] | AcceptTradesRequest): Promise<CsfloatTrade[]> {
    const body = Array.isArray(tradeIds)
      ? { trade_ids: tradeIds }
      : tradeIds;

    return this.client.post<CsfloatTrade[]>("trades/bulk/received", body);
  }

  /**
   * Low-level single-trade receipt helper for the browser-confirmed buyer route.
   * This is intentionally separate from `markTradesReceived()` because the backend
   * still gates success on the real Steam-offer lifecycle.
   */
  markTradeReceived(tradeId: string): Promise<CsfloatTradeActionResponse> {
    return this.client.post<CsfloatTradeActionResponse>(`trades/${tradeId}/received`, {});
  }

  acceptTrade(tradeId: string): Promise<CsfloatTrade> {
    return this.client.post<CsfloatTrade>(`trades/${tradeId}/accept`, {});
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

  /**
   * Low-level rollback helper for bundle-confirmed seller/buyer recovery flows.
   * Keep this conservative: route shape is stable, outcome semantics are still trade-state-specific.
   */
  rollbackTrade(tradeId: string): Promise<CsfloatTradeActionResponse> {
    return this.client.post<CsfloatTradeActionResponse>(`trades/${tradeId}/rollback`, {});
  }

  /**
   * Low-level manual-verification helper for the current browser-confirmed route.
   */
  manualVerifyTrade(tradeId: string): Promise<CsfloatTradeActionResponse> {
    return this.client.post<CsfloatTradeActionResponse>(`trades/${tradeId}/manual-verification`, {});
  }

  /**
   * Low-level rollback verification helper for the current browser-confirmed route.
   */
  verifyTradeRollback(tradeId: string): Promise<CsfloatTradeActionResponse> {
    return this.client.post<CsfloatTradeActionResponse>(`trades/${tradeId}/rollback-verify`, {});
  }

  getOffers(params: CsfloatOffersParams = {}): Promise<CsfloatOffersResponse> {
    return this.client.get<CsfloatOffersResponse>("me/offers", params as QueryParams);
  }

  createOffer(request: CreateOfferRequest): Promise<CsfloatOffer> {
    return this.client.post<CsfloatOffer>("offers", request);
  }

  getOffer(offerId: string): Promise<CsfloatOffer> {
    return this.client.get<CsfloatOffer>(`offers/${offerId}`);
  }

  /**
   * Low-level accept helper for the browser-observed offer acceptance route.
   * Current live validation confirms the route exists, but happy-path response
   * semantics remain only partially mapped.
   */
  acceptOffer(offerId: string): Promise<CsfloatAcceptOfferResponse> {
    return this.client.post<CsfloatAcceptOfferResponse>(`offers/${offerId}/accept`, {});
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

  getWatchlist(
    params: CsfloatWatchlistParams = {},
  ): Promise<CsfloatListingsResponse> {
    return this.client.get<CsfloatListingsResponse>("me/watchlist", params as QueryParams);
  }

  iterateWatchlist(params: Omit<CsfloatWatchlistParams, "cursor"> = {}) {
    return paginateCursor<CsfloatListingsResponse, CsfloatListing>({
      loadPage: (cursor) =>
        this.getWatchlist(
          cursor === undefined ? { ...params } : { ...params, cursor },
        ),
      getItems: (page) => page.data,
    });
  }

  getOffersTimeline(params: Pick<CsfloatPageParams, "limit"> = {}): Promise<CsfloatOffersResponse> {
    return this.client.get<CsfloatOffersResponse>("me/offers-timeline", params as QueryParams);
  }

  getNotifications(
    params: CsfloatNotificationsParams = {},
  ): Promise<CsfloatNotificationsResponse> {
    return this.client.get<CsfloatNotificationsResponse>(
      "me/notifications/timeline",
      params as QueryParams,
    );
  }

  getTransactions(
    params: CsfloatTransactionsParams = {},
  ): Promise<CsfloatTransactionsResponse> {
    return this.client.get<CsfloatTransactionsResponse>("me/transactions", params as QueryParams);
  }

  exportTransactions(year: number, month: number): Promise<string> {
    return this.client.get<string>("me/transactions/export", { year, month });
  }

  getAccountStanding(): Promise<CsfloatAccountStandingResponse> {
    return this.client.get<CsfloatAccountStandingResponse>("me/account-standing");
  }

  getBuyOrders(params: CsfloatBuyOrdersParams = {}): Promise<CsfloatBuyOrdersResponse> {
    return this.client.get<CsfloatBuyOrdersResponse>("me/buy-orders", params as QueryParams);
  }

  getBuyOrdersForInspect(
    inspectLink: string,
    limit = 3,
  ): Promise<CsfloatInspectBuyOrdersResponse> {
    return this.client.get<CsfloatInspectBuyOrdersResponse>(
      "buy-orders/item",
      {
        url: inspectLink,
        limit,
      },
    );
  }

  getSimilarBuyOrders(
    request: SimilarBuyOrdersRequest,
    limit?: number,
  ): Promise<CsfloatSimilarBuyOrdersResponse> {
    return this.client.post<CsfloatSimilarBuyOrdersResponse>(
      "buy-orders/similar-orders",
      request,
      limit === undefined ? undefined : { limit },
    );
  }

  createBuyOrder(request: CreateBuyOrderRequest): Promise<CsfloatBuyOrder> {
    return this.client.post<CsfloatBuyOrder>(
      "buy-orders",
      "expression" in request
        ? {
            expression: request.expression,
            max_price: request.max_price,
            ...(request.quantity === undefined ? {} : { quantity: request.quantity }),
          }
        : {
            market_hash_name: request.market_hash_name,
            max_price: request.max_price,
            ...(request.quantity === undefined ? {} : { quantity: request.quantity }),
          },
    );
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

  createGsInspectToken(): Promise<CsfloatGsInspectTokenResponse> {
    return this.client.post<CsfloatGsInspectTokenResponse>("me/gs-inspect-token", {});
  }

  getMaxWithdrawable(): Promise<CsfloatMaxWithdrawableResponse> {
    return this.client.get<CsfloatMaxWithdrawableResponse>("me/payments/max-withdrawable");
  }

  getPendingDeposits(): Promise<CsfloatPendingDeposit[]> {
    return this.client.get<CsfloatPendingDeposit[]>("me/payments/pending-deposits");
  }

  getPendingWithdrawals(): Promise<CsfloatPendingWithdrawal[]> {
    return this.client.get<CsfloatPendingWithdrawal[]>("me/pending-withdrawals");
  }

  deletePendingWithdrawal(
    withdrawalId: string | number,
  ): Promise<CsfloatMessageResponse | null> {
    return this.client.delete<CsfloatMessageResponse | null>(
      `me/pending-withdrawals/${withdrawalId}`,
    );
  }

  getExtensionStatus(): Promise<CsfloatExtensionStatusResponse> {
    return this.client.get<CsfloatExtensionStatusResponse>("me/extension/status");
  }

  getMobileStatus(): Promise<CsfloatMobileStatusResponse> {
    return this.client.get<CsfloatMobileStatusResponse>("me/mobile/status");
  }

  /**
   * Low-level email verification helper confirmed by the current frontend bundle
   * and a live invalid-payload probe (`invalid email format`).
   *
   * Pass only `email` to request a verification message, or include `token` to confirm it.
   */
  verifyEmail(
    emailOrRequest: string | CsfloatVerifyEmailRequest,
    token?: string,
  ): Promise<CsfloatMessageResponse> {
    const body = typeof emailOrRequest === "string"
      ? { email: emailOrRequest, ...(token === undefined ? {} : { token }) }
      : emailOrRequest;

    return this.client.post<CsfloatMessageResponse>("me/verify-email", body);
  }

  /**
   * Low-level SMS verification helper confirmed by the current frontend bundle
   * and a live invalid-payload probe (`twilio: Invalid phone number: abc`).
   *
   * Pass only `phoneNumber` to request an SMS token, or include `token` to confirm it.
   */
  verifySms(
    phoneNumberOrRequest: string | CsfloatVerifySmsRequest,
    token?: string,
  ): Promise<CsfloatMessageResponse> {
    const body = typeof phoneNumberOrRequest === "string"
      ? { phone_number: phoneNumberOrRequest, ...(token === undefined ? {} : { token }) }
      : phoneNumberOrRequest;

    return this.client.post<CsfloatMessageResponse>("me/verify-sms", body);
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
