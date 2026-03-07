import { describe, expect, it } from "vitest";

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
});
