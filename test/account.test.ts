import { describe, expect, it, vi } from "vitest";

import { AccountResource } from "../src/resources/account.js";

describe("AccountResource", () => {
  it("requests authenticated trades with params", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getTrades({ limit: 5, cursor: "abc" });

    expect(get).toHaveBeenCalledWith("me/trades", {
      limit: 5,
      cursor: "abc",
    });
  });

  it("requests authenticated offers with params", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getOffers({ limit: 1 });

    expect(get).toHaveBeenCalledWith("me/offers", {
      limit: 1,
    });
  });

  it("requests authenticated watchlist with params", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getWatchlist({ limit: 20, cursor: "next-page" });

    expect(get).toHaveBeenCalledWith("me/watchlist", {
      limit: 20,
      cursor: "next-page",
    });
  });
});
