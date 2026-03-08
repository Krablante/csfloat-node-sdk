import { describe, expect, it, vi } from "vitest";

import { StallResource } from "../src/resources/stall.js";

describe("StallResource", () => {
  it("requests a public stall with listing-style params", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new StallResource({ get } as never);

    await resource.getStall("76561198771627775", {
      limit: 51,
      cursor: "next-page",
      sort_by: "lowest_price",
      filter: "unique",
      type: "buy_now",
      min_ref_qty: 20,
      keychains: JSON.stringify([{ i: 83 }]),
    });

    expect(get).toHaveBeenCalledWith("users/76561198771627775/stall", {
      limit: 51,
      cursor: "next-page",
      sort_by: "lowest_price",
      filter: "unique",
      type: "buy_now",
      min_ref_qty: 20,
      keychains: JSON.stringify([{ i: 83 }]),
    });
  });
});
