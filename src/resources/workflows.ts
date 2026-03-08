import {
  buildSingleSkinBuyOrderExpression,
  buildSingleSkinBuyOrderRequest,
} from "../buy-order.js";
import {
  getHomepageFeedParams,
  getPublicMarketPageParams,
} from "../market.js";
import type { AccountResource } from "./account.js";
import type { ListingsResource } from "./listings.js";
import type { StallResource } from "./stall.js";
import type {
  CsfloatAccountWorkspaceOptions,
  CsfloatAccountWorkspaceResult,
  CsfloatPublicMarketFeedWorkflowOptions,
  CsfloatPublicMarketFeedWorkflowResult,
  CsfloatSingleSkinBuyOrderInsightOptions,
  CsfloatSingleSkinBuyOrderInsightResult,
} from "../workflows.js";
import {
  CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS,
  CSFLOAT_BUY_ORDER_INSIGHT_DEFAULTS,
  CSFLOAT_PUBLIC_FEED_WORKFLOW_DEFAULTS,
} from "../workflows.js";

export class WorkflowResource {
  constructor(
    private readonly account: AccountResource,
    private readonly listings: ListingsResource,
    private readonly stall: StallResource,
  ) {}

  async getPublicMarketFeeds(
    options: CsfloatPublicMarketFeedWorkflowOptions = {},
  ): Promise<CsfloatPublicMarketFeedWorkflowResult> {
    const publicPageLimit =
      options.public_page_limit ?? CSFLOAT_PUBLIC_FEED_WORKFLOW_DEFAULTS.public_page_limit;
    const feedLimit = options.feed_limit ?? CSFLOAT_PUBLIC_FEED_WORKFLOW_DEFAULTS.feed_limit;

    const [publicSearchPage, topDeals, newest, unique] = await Promise.all([
      this.listings.getListings({
        ...getPublicMarketPageParams(),
        limit: publicPageLimit,
      }),
      this.listings.getListings({
        ...getHomepageFeedParams("top_deals"),
        limit: feedLimit,
      }),
      this.listings.getListings({
        ...getHomepageFeedParams("newest"),
        limit: feedLimit,
      }),
      this.listings.getListings({
        ...getHomepageFeedParams("unique"),
        limit: feedLimit,
      }),
    ]);

    return {
      public_search_page: publicSearchPage.data,
      top_deals: topDeals.data,
      newest: newest.data,
      unique: unique.data,
    };
  }

  async getAccountWorkspace(
    options: CsfloatAccountWorkspaceOptions = {},
  ): Promise<CsfloatAccountWorkspaceResult> {
    const me = await this.account.getMe();
    const steamId = me.user.steam_id;
    const watchlistLimit = options.watchlist_limit ?? CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS.watchlist_limit;
    const stallLimit = options.stall_limit ?? CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS.stall_limit;
    const offerLimit = options.offer_limit ?? CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS.offer_limit;
    const tradeLimit = options.trade_limit ?? CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS.trade_limit;
    const autoBidLimit = options.auto_bid_limit ?? CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS.auto_bid_limit;

    const [watchlist, stall, offers, trades, autoBids] = await Promise.all([
      this.account.getWatchlist({
        limit: watchlistLimit,
        state: "listed",
        sort_by: "most_recent",
      }),
      this.stall.getStall(steamId, {
        limit: stallLimit,
        type: "buy_now",
        sort_by: "lowest_price",
      }),
      this.account.getOffers({
        limit: offerLimit,
        page: 0,
      }),
      this.account.getTrades({
        limit: tradeLimit,
        page: 0,
        role: "seller",
        state: "queued,pending",
      }),
      this.account.getAutoBids(),
    ]);

    return {
      me,
      watchlist: watchlist.data,
      stall: stall.data,
      offers: offers.offers,
      trades: trades.trades,
      auto_bids: autoBids.slice(0, autoBidLimit),
    };
  }

  async getSingleSkinBuyOrderInsights(
    defIndex: number,
    paintIndex: number,
    options: CsfloatSingleSkinBuyOrderInsightOptions = {},
  ): Promise<CsfloatSingleSkinBuyOrderInsightResult> {
    const similarLimit = options.similar_limit ?? CSFLOAT_BUY_ORDER_INSIGHT_DEFAULTS.similar_limit;
    const listingLimit = options.listing_limit ?? CSFLOAT_BUY_ORDER_INSIGHT_DEFAULTS.listing_limit;
    const previewMaxPrice =
      options.preview_max_price ?? CSFLOAT_BUY_ORDER_INSIGHT_DEFAULTS.preview_max_price;
    const sortBy = options.sort_by ?? CSFLOAT_BUY_ORDER_INSIGHT_DEFAULTS.sort_by;

    const expression = buildSingleSkinBuyOrderExpression(defIndex, paintIndex, {
      ...(options.min_float === undefined ? {} : { min_float: options.min_float }),
      ...(options.max_float === undefined ? {} : { max_float: options.max_float }),
      ...(options.paint_seed === undefined ? {} : { paint_seed: options.paint_seed }),
      ...(options.rarity === undefined ? {} : { rarity: options.rarity }),
      ...(options.souvenir === undefined ? {} : { souvenir: options.souvenir }),
      ...(options.stattrak === undefined ? {} : { stattrak: options.stattrak }),
    });

    const requestPreview = buildSingleSkinBuyOrderRequest(defIndex, paintIndex, {
      max_price: previewMaxPrice,
      ...(options.quantity === undefined ? {} : { quantity: options.quantity }),
      ...(options.min_float === undefined ? {} : { min_float: options.min_float }),
      ...(options.max_float === undefined ? {} : { max_float: options.max_float }),
      ...(options.paint_seed === undefined ? {} : { paint_seed: options.paint_seed }),
      ...(options.rarity === undefined ? {} : { rarity: options.rarity }),
      ...(options.souvenir === undefined ? {} : { souvenir: options.souvenir }),
      ...(options.stattrak === undefined ? {} : { stattrak: options.stattrak }),
    });

    const [similarOrders, matchingListings] = await Promise.all([
      this.account.getSimilarBuyOrders({ expression }, similarLimit),
      this.listings.getListings({
        def_index: defIndex,
        paint_index: paintIndex,
        limit: listingLimit,
        sort_by: sortBy,
      }),
    ]);

    return {
      expression,
      request_preview: requestPreview,
      similar_orders: similarOrders.data,
      matching_listings: matchingListings.data,
    };
  }
}
