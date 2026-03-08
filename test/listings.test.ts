import { describe, expect, it, vi } from "vitest";

import { CsfloatSdkError } from "../src/errors.js";
import { ListingsResource } from "../src/resources/listings.js";

describe("ListingsResource", () => {
  const client = {
    get: async () => ({ data: [] }),
    post: async (_path: string, body: unknown) => body,
    patch: async () => null,
    delete: async () => null,
  } as never;

  it("builds a buy_now listing payload with explicit type", async () => {
    const resource = new ListingsResource(client);
    const result = await resource.createBuyNowListing({
      asset_id: "123",
      price: 100,
    });

    expect(result).toMatchObject({
      asset_id: "123",
      price: 100,
      type: "buy_now",
    });
  });

  it("builds an auction listing payload with the expected shape", async () => {
    const resource = new ListingsResource(client);
    const result = await resource.createAuctionListing({
      type: "auction",
      asset_id: "123",
      reserve_price: 100,
      duration_days: 3,
      private: true,
      description: "cheap test",
    });

    expect(result).toMatchObject({
      type: "auction",
      asset_id: "123",
      reserve_price: 100,
      duration_days: 3,
      private: true,
      description: "cheap test",
    });
  });

  it("rejects invalid auction duration", async () => {
    const resource = new ListingsResource(client);

    expect(() =>
      resource.createAuctionListing({
        type: "auction",
        asset_id: "123",
        reserve_price: 100,
        duration_days: 2 as never,
      }),
    ).toThrow(CsfloatSdkError);
  });

  it("requests bids for a listing", async () => {
    const get = vi.fn(async (_path: string) => []);
    const resource = new ListingsResource({
      ...client,
      get,
    } as never);

    await resource.getBids("949824804901487637");

    expect(get).toHaveBeenCalledWith("listings/949824804901487637/bids");
  });

  it("passes discovered market params through getListings", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => ({ data: [] }));
    const resource = new ListingsResource({
      ...client,
      get,
    } as never);

    await resource.getListings({
      limit: 40,
      sort_by: "most_recent",
      filter: "unique",
      source: 3,
      min_ref_qty: 20,
      category: 3,
      collection: "set_cobblestone",
      rarity: 6,
      min_price: 1000,
      max_price: 100000,
      def_index: 4,
      paint_index: 437,
      paint_seed: 611,
      sticker_index: 73,
      keychain_index: 29,
      keychain_highlight_reel: 1,
      music_kit_index: 3,
      min_blue: 90,
      max_blue: 100,
      min_fade: 80,
      max_fade: 100,
    });

    expect(get).toHaveBeenCalledWith("listings", {
      limit: 40,
      sort_by: "most_recent",
      filter: "unique",
      source: 3,
      min_ref_qty: 20,
      category: 3,
      collection: "set_cobblestone",
      rarity: 6,
      min_price: 1000,
      max_price: 100000,
      def_index: 4,
      paint_index: 437,
      paint_seed: 611,
      sticker_index: 73,
      keychain_index: 29,
      keychain_highlight_reel: 1,
      music_kit_index: 3,
      min_blue: 90,
      max_blue: 100,
      min_fade: 80,
      max_fade: 100,
    });
  });

  it("requests the public price list", async () => {
    const get = vi.fn(async (_path: string) => []);
    const resource = new ListingsResource({
      ...client,
      get,
    } as never);

    await resource.getPriceList();

    expect(get).toHaveBeenCalledWith("listings/price-list");
  });

  it("requests listing buy orders", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => []);
    const resource = new ListingsResource({
      ...client,
      get,
    } as never);

    await resource.getBuyOrders("948726619852374910", { limit: 10 });

    expect(get).toHaveBeenCalledWith("listings/948726619852374910/buy-orders", {
      limit: 10,
    });
  });

  it("requests similar listings", async () => {
    const get = vi.fn(async (_path: string) => []);
    const resource = new ListingsResource({
      ...client,
      get,
    } as never);

    await resource.getSimilar("948726619852374910");

    expect(get).toHaveBeenCalledWith("listings/948726619852374910/similar");
  });

  it("adds a listing to watchlist", async () => {
    const post = vi.fn(async (_path: string, _body?: unknown) => ({ message: "added to watchlist" }));
    const resource = new ListingsResource({
      ...client,
      post,
    } as never);

    await resource.addToWatchlist("950170960026273280");

    expect(post).toHaveBeenCalledWith("listings/950170960026273280/watchlist", {});
  });

  it("removes a listing from watchlist", async () => {
    const del = vi.fn(async (_path: string) => ({ message: "removed from watchlist" }));
    const resource = new ListingsResource({
      ...client,
      delete: del,
    } as never);

    await resource.removeFromWatchlist("950170960026273280");

    expect(del).toHaveBeenCalledWith("listings/950170960026273280/watchlist");
  });

  it("purchases multiple listings with buyNow", async () => {
    const post = vi.fn(async (_path: string, _body?: unknown) => ({ message: "all listings purchased" }));
    const resource = new ListingsResource({
      ...client,
      post,
    } as never);

    await resource.buyNow({
      contract_ids: ["807440137469430127", "807440137519761776"],
      total_price: 6,
    });

    expect(post).toHaveBeenCalledWith("listings/buy", {
      contract_ids: ["807440137469430127", "807440137519761776"],
      total_price: 6,
    });
  });

  it("purchases a single listing with buyListing", async () => {
    const post = vi.fn(async (_path: string, _body?: unknown) => ({ message: "all listings purchased" }));
    const resource = new ListingsResource({
      ...client,
      post,
    } as never);

    await resource.buyListing("807440137469430127", 3);

    expect(post).toHaveBeenCalledWith("listings/buy", {
      contract_ids: ["807440137469430127"],
      total_price: 3,
    });
  });

  it("places a max-price auction bid", async () => {
    const post = vi.fn(async (_path: string, _body?: unknown) => ({
      id: "950549984967789614",
      created_at: "2026-03-08T00:26:16.781463974Z",
      max_price: 9,
      contract_id: "945821907352158315",
    }));
    const resource = new ListingsResource({
      ...client,
      post,
    } as never);

    await resource.placeBid("945821907352158315", {
      max_price: 9,
    });

    expect(post).toHaveBeenCalledWith("listings/945821907352158315/bid", {
      max_price: 9,
    });
  });
});
