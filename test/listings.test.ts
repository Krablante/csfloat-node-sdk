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
});
