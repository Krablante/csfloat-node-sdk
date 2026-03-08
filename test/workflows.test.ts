import { describe, expect, it, vi } from "vitest";

import { WorkflowResource } from "../src/resources/workflows.js";

describe("WorkflowResource", () => {
  it("loads the public market workflow snapshot", async () => {
    const listings = {
      getListings: vi
        .fn()
        .mockResolvedValueOnce({ data: [{ id: "public" }] })
        .mockResolvedValueOnce({ data: [{ id: "top" }] })
        .mockResolvedValueOnce({ data: [{ id: "newest" }] })
        .mockResolvedValueOnce({ data: [{ id: "unique" }] }),
    };

    const resource = new WorkflowResource({} as never, listings as never, {} as never);
    const result = await resource.getPublicMarketFeeds({
      public_page_limit: 20,
      feed_limit: 3,
    });

    expect(result).toEqual({
      public_search_page: [{ id: "public" }],
      top_deals: [{ id: "top" }],
      newest: [{ id: "newest" }],
      unique: [{ id: "unique" }],
    });
    expect(listings.getListings).toHaveBeenNthCalledWith(1, {
      limit: 20,
      min_ref_qty: 20,
    });
    expect(listings.getListings).toHaveBeenNthCalledWith(2, {
      limit: 3,
      min_ref_qty: 20,
      type: "buy_now",
      min_price: 500,
    });
    expect(listings.getListings).toHaveBeenNthCalledWith(3, {
      limit: 3,
      min_ref_qty: 20,
      type: "buy_now",
      min_price: 500,
      sort_by: "most_recent",
    });
    expect(listings.getListings).toHaveBeenNthCalledWith(4, {
      limit: 3,
      min_ref_qty: 20,
      type: "buy_now",
      min_price: 500,
      sort_by: "most_recent",
      filter: "unique",
    });
  });

  it("loads the authenticated account workspace snapshot", async () => {
    const account = {
      getMe: vi.fn(async () => ({
        user: {
          steam_id: "7656119",
        },
      })),
      getWatchlist: vi.fn(async () => ({ data: [{ id: "watch" }] })),
      getOffers: vi.fn(async () => ({ offers: [{ id: "offer" }] })),
      getTrades: vi.fn(async () => ({ trades: [{ id: "trade" }] })),
      getAutoBids: vi.fn(async () => [{ id: "bid1" }, { id: "bid2" }]),
    };
    const stall = {
      getStall: vi.fn(async () => ({ data: [{ id: "stall" }] })),
    };

    const resource = new WorkflowResource(account as never, {} as never, stall as never);
    const result = await resource.getAccountWorkspace({
      watchlist_limit: 2,
      stall_limit: 3,
      offer_limit: 4,
      trade_limit: 5,
      auto_bid_limit: 1,
    });

    expect(result.watchlist).toEqual([{ id: "watch" }]);
    expect(result.stall).toEqual([{ id: "stall" }]);
    expect(result.offers).toEqual([{ id: "offer" }]);
    expect(result.trades).toEqual([{ id: "trade" }]);
    expect(result.auto_bids).toEqual([{ id: "bid1" }]);

    expect(account.getWatchlist).toHaveBeenCalledWith({
      limit: 2,
      state: "listed",
      sort_by: "most_recent",
    });
    expect(stall.getStall).toHaveBeenCalledWith("7656119", {
      limit: 3,
      type: "buy_now",
      sort_by: "lowest_price",
    });
    expect(account.getOffers).toHaveBeenCalledWith({
      limit: 4,
      page: 0,
    });
    expect(account.getTrades).toHaveBeenCalledWith({
      limit: 5,
      page: 0,
      role: "seller",
      state: "queued,pending",
    });
  });

  it("builds single-skin buy-order insights", async () => {
    const account = {
      getSimilarBuyOrders: vi.fn(async () => ({
        data: [{ market_hash_name: "AK-47 | Safari Mesh (Factory New)", qty: 1, price: 1320 }],
      })),
    };
    const listings = {
      getListings: vi.fn(async () => ({
        data: [{ id: "listing-1", item: { market_hash_name: "AK-47 | Safari Mesh (Field-Tested)" } }],
      })),
    };

    const resource = new WorkflowResource(account as never, listings as never, {} as never);
    const result = await resource.getSingleSkinBuyOrderInsights(7, 72, {
      similar_limit: 3,
      listing_limit: 2,
      stattrak: false,
      souvenir: false,
      preview_max_price: 3,
      quantity: 1,
    });

    expect(result.request_preview.max_price).toBe(3);
    expect(result.similar_orders).toEqual([
      { market_hash_name: "AK-47 | Safari Mesh (Factory New)", qty: 1, price: 1320 },
    ]);
    expect(result.matching_listings).toEqual([
      { id: "listing-1", item: { market_hash_name: "AK-47 | Safari Mesh (Field-Tested)" } },
    ]);

    expect(account.getSimilarBuyOrders).toHaveBeenCalledWith(
      {
        expression: {
          condition: "and",
          rules: [
            {
              field: "DefIndex",
              operator: "==",
              value: { constant: "7" },
            },
            {
              field: "PaintIndex",
              operator: "==",
              value: { constant: "72" },
            },
            {
              field: "StatTrak",
              operator: "==",
              value: { constant: "false" },
            },
            {
              field: "Souvenir",
              operator: "==",
              value: { constant: "false" },
            },
          ],
        },
      },
      3,
    );
    expect(listings.getListings).toHaveBeenCalledWith({
      def_index: 7,
      paint_index: 72,
      limit: 2,
      sort_by: "lowest_price",
    });
  });
});
