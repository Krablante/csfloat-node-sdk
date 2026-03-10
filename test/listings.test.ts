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

  it("builds a bulk buy_now listing payload with explicit defaults", async () => {
    const post = vi.fn(async (_path: string, body: { items: unknown[] }) => ({ data: body.items }));
    const resource = new ListingsResource({
      ...client,
      post,
    } as never);

    const result = await resource.createBulkListings([
      {
        asset_id: "123",
        price: 100,
        private: true,
      },
      {
        asset_id: "456",
        price: 200,
        description: "bulk test",
      },
    ]);

    expect(post).toHaveBeenCalledWith("listings/bulk-list", {
      items: [
        {
          asset_id: "123",
          price: 100,
          private: true,
          type: "buy_now",
        },
        {
          asset_id: "456",
          price: 200,
          description: "bulk test",
          type: "buy_now",
        },
      ],
    });
    expect(result).toHaveLength(2);
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

  it("rejects empty bulk listing payloads", async () => {
    const resource = new ListingsResource(client);

    expect(() => resource.createBulkListings([])).toThrow(CsfloatSdkError);
  });

  it("updates bulk listing prices", async () => {
    const patch = vi.fn(async (_path: string, body: { modifications: unknown[] }) => ({
      data: body.modifications,
    }));
    const resource = new ListingsResource({
      ...client,
      patch,
    } as never);

    await resource.updateBulkListings([
      { contract_id: "a", price: 4 },
      { contract_id: "b", price: 5 },
    ]);

    expect(patch).toHaveBeenCalledWith("listings/bulk-modify", {
      modifications: [
        { contract_id: "a", price: 4 },
        { contract_id: "b", price: 5 },
      ],
    });
  });

  it("rejects empty bulk modifications", async () => {
    const resource = new ListingsResource(client);

    expect(() => resource.updateBulkListings([])).toThrow(CsfloatSdkError);
  });

  it("provides a price-only listing update helper", async () => {
    const patch = vi.fn(async (_path: string, body: unknown) => body);
    const resource = new ListingsResource({
      ...client,
      patch,
    } as never);

    await resource.updateListingPrice("listing-1", 1337);

    expect(patch).toHaveBeenCalledWith("listings/listing-1", {
      price: 1337,
    });
  });

  it("provides a description-only listing update helper", async () => {
    const patch = vi.fn(async (_path: string, body: unknown) => body);
    const resource = new ListingsResource({
      ...client,
      patch,
    } as never);

    await resource.updateListingDescription("listing-1", "test text");

    expect(patch).toHaveBeenCalledWith("listings/listing-1", {
      description: "test text",
    });
  });

  it("provides a max-offer-discount listing update helper", async () => {
    const patch = vi.fn(async (_path: string, body: unknown) => body);
    const resource = new ListingsResource({
      ...client,
      patch,
    } as never);

    await resource.updateListingMaxOfferDiscount("listing-1", 12);

    expect(patch).toHaveBeenCalledWith("listings/listing-1", {
      max_offer_discount: 12,
    });
  });

  it("provides a privacy-only listing update helper", async () => {
    const patch = vi.fn(async (_path: string, body: unknown) => body);
    const resource = new ListingsResource({
      ...client,
      patch,
    } as never);

    await resource.updateListingPrivate("listing-1", true);

    expect(patch).toHaveBeenCalledWith("listings/listing-1", {
      private: true,
    });
  });

  it("delists listings in bulk", async () => {
    const patch = vi.fn(async (_path: string, _body?: unknown) => ({ message: "contracts delisted" }));
    const resource = new ListingsResource({
      ...client,
      patch,
    } as never);

    await resource.deleteBulkListings(["a", "b"]);

    expect(patch).toHaveBeenCalledWith("listings/bulk-delist", {
      contract_ids: ["a", "b"],
    });
  });

  it("aliases unlistBulkListings to the same bulk-delist route", async () => {
    const patch = vi.fn(async (_path: string, _body?: unknown) => ({ message: "contracts delisted" }));
    const resource = new ListingsResource({
      ...client,
      patch,
    } as never);

    await resource.unlistBulkListings(["a"]);

    expect(patch).toHaveBeenCalledWith("listings/bulk-delist", {
      contract_ids: ["a"],
    });
  });

  it("rejects empty bulk delist payloads", async () => {
    const resource = new ListingsResource(client);

    expect(() => resource.deleteBulkListings([])).toThrow(CsfloatSdkError);
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
      stickers: JSON.stringify([{ i: 3 }]),
      keychains: JSON.stringify([{ i: 83 }]),
      sticker_option: "skins",
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
      stickers: JSON.stringify([{ i: 3 }]),
      keychains: JSON.stringify([{ i: 83 }]),
      sticker_option: "skins",
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
