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

  it("requests offers timeline", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getOffersTimeline({ limit: 10 });

    expect(get).toHaveBeenCalledWith("me/offers-timeline", {
      limit: 10,
    });
  });

  it("requests notifications timeline", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getNotifications();

    expect(get).toHaveBeenCalledWith("me/notifications/timeline");
  });

  it("requests transactions with paging params", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getTransactions({ limit: 1, page: 2 });

    expect(get).toHaveBeenCalledWith("me/transactions", {
      limit: 1,
      page: 2,
    });
  });

  it("requests account standing", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getAccountStanding();

    expect(get).toHaveBeenCalledWith("me/account-standing");
  });

  it("requests buy orders", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getBuyOrders({ limit: 5, page: 0 });

    expect(get).toHaveBeenCalledWith("me/buy-orders", {
      limit: 5,
      page: 0,
    });
  });

  it("requests auto bids", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getAutoBids();

    expect(get).toHaveBeenCalledWith("me/auto-bids");
  });

  it("requests mobile status", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getMobileStatus();

    expect(get).toHaveBeenCalledWith("me/mobile/status");
  });
});
