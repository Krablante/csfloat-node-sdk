import { CsfloatSdk } from "../dist/index.js";

const apiKey = process.env.CSFLOAT_API_KEY;

if (!apiKey) {
  throw new Error("Missing CSFLOAT_API_KEY");
}

const sdk = new CsfloatSdk({
  apiKey,
  minRequestDelayMs: 1250,
});

const [feeds, workspace, buyOrderInsights] = await Promise.all([
  sdk.workflows.getPublicMarketFeeds({
    feed_limit: 3,
    public_page_limit: 10,
  }),
  sdk.workflows.getAccountWorkspace({
    watchlist_limit: 3,
    stall_limit: 3,
    offer_limit: 3,
    trade_limit: 3,
    auto_bid_limit: 3,
  }),
  sdk.workflows.getSingleSkinBuyOrderInsights(7, 72, {
    stattrak: false,
    souvenir: false,
    similar_limit: 3,
    listing_limit: 3,
  }),
]);

console.log(
  JSON.stringify(
    {
      public_feeds: {
        top_deals: feeds.top_deals.map((listing) => ({
          id: listing.id,
          market_hash_name: listing.item?.market_hash_name,
          price: listing.price,
        })),
        newest: feeds.newest.map((listing) => ({
          id: listing.id,
          market_hash_name: listing.item?.market_hash_name,
          price: listing.price,
        })),
      },
      workspace: {
        me: {
          steam_id: workspace.me.user.steam_id,
          username: workspace.me.user.username,
        },
        watchlist_ids: workspace.watchlist.map((listing) => listing.id),
        stall_ids: workspace.stall.map((listing) => listing.id),
        offer_ids: workspace.offers.map((offer) => offer.id),
        trade_ids: workspace.trades.map((trade) => trade.id),
      },
      buy_order_insights: {
        request_preview: buyOrderInsights.request_preview,
        similar_orders: buyOrderInsights.similar_orders,
        matching_listing_ids: buyOrderInsights.matching_listings.map((listing) => listing.id),
      },
    },
    null,
    2,
  ),
);
