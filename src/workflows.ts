import type {
  CsfloatAutoBid,
  CsfloatBuyOrderExpressionGroup,
  CsfloatCreateExpressionBuyOrderRequest,
  CsfloatListing,
  CsfloatMeResponse,
  CsfloatOffer,
  CsfloatTrade,
  SortBy,
} from "./types.js";

export const CSFLOAT_PUBLIC_FEED_WORKFLOW_DEFAULTS = {
  feed_limit: 5,
  public_page_limit: 40,
} as const;

export const CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS = {
  auto_bid_limit: 10,
  offer_limit: 5,
  stall_limit: 5,
  trade_limit: 5,
  watchlist_limit: 5,
} as const;

export const CSFLOAT_BUY_ORDER_INSIGHT_DEFAULTS = {
  listing_limit: 5,
  preview_max_price: 3,
  similar_limit: 5,
  sort_by: "lowest_price" as const satisfies SortBy,
} as const;

export interface CsfloatPublicMarketFeedWorkflowOptions {
  feed_limit?: number;
  public_page_limit?: number;
}

export interface CsfloatPublicMarketFeedWorkflowResult {
  newest: CsfloatListing[];
  public_search_page: CsfloatListing[];
  top_deals: CsfloatListing[];
  unique: CsfloatListing[];
}

export interface CsfloatAccountWorkspaceOptions {
  auto_bid_limit?: number;
  offer_limit?: number;
  stall_limit?: number;
  trade_limit?: number;
  watchlist_limit?: number;
}

export interface CsfloatAccountWorkspaceResult {
  auto_bids: CsfloatAutoBid[];
  me: CsfloatMeResponse;
  offers: CsfloatOffer[];
  stall: CsfloatListing[];
  trades: CsfloatTrade[];
  watchlist: CsfloatListing[];
}

export interface CsfloatSingleSkinBuyOrderInsightOptions {
  listing_limit?: number;
  max_float?: number;
  paint_seed?: number;
  preview_max_price?: number;
  quantity?: number;
  rarity?: number;
  similar_limit?: number;
  sort_by?: SortBy;
  souvenir?: boolean;
  stattrak?: boolean;
  min_float?: number;
}

export interface CsfloatSingleSkinBuyOrderInsightResult {
  expression: CsfloatBuyOrderExpressionGroup;
  matching_listings: CsfloatListing[];
  request_preview: CsfloatCreateExpressionBuyOrderRequest;
  similar_orders: Array<{
    market_hash_name?: string;
    price?: number;
    qty?: number;
  }>;
}
