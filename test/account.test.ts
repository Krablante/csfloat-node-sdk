import { describe, expect, it, vi } from "vitest";

import { AccountResource } from "../src/resources/account.js";

describe("AccountResource", () => {
  it("requests authenticated trades with params", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getTrades({ limit: 5, cursor: "abc", state: "queued,pending", role: "seller", page: 0 });

    expect(get).toHaveBeenCalledWith("me/trades", {
      limit: 5,
      cursor: "abc",
      state: "queued,pending",
      role: "seller",
      page: 0,
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

  it("creates a recommender token", async () => {
    const post = vi.fn(async (_path: string, _body?: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.createRecommenderToken();

    expect(post).toHaveBeenCalledWith("me/recommender-token", {});
  });

  it("accepts trades in bulk", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.acceptTrades(["950524496987687389"]);

    expect(post).toHaveBeenCalledWith("trades/bulk/accept", {
      trade_ids: ["950524496987687389"],
    });
  });

  it("accepts a single trade", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.acceptTrade("950524496987687389");

    expect(post).toHaveBeenCalledWith("trades/bulk/accept", {
      trade_ids: ["950524496987687389"],
    });
  });

  it("accepts a sale through the single-trade alias", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.acceptSale("950524496987687389");

    expect(post).toHaveBeenCalledWith("trades/bulk/accept", {
      trade_ids: ["950524496987687389"],
    });
  });

  it("creates an offer", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.createOffer({
      contract_id: "947853172867730629",
      price: 2970,
    });

    expect(post).toHaveBeenCalledWith("offers", {
      contract_id: "947853172867730629",
      price: 2970,
    });
  });

  it("requests a single offer by id", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getOffer("950518288876703091");

    expect(get).toHaveBeenCalledWith("offers/950518288876703091");
  });

  it("requests offer history by id", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getOfferHistory("950518288876703091");

    expect(get).toHaveBeenCalledWith("offers/950518288876703091/history");
  });

  it("creates a counter-offer", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.counterOffer("950527459638512595", { price: 3000 });

    expect(post).toHaveBeenCalledWith("offers/950527459638512595/counter-offer", {
      price: 3000,
    });
  });

  it("cancels an offer", async () => {
    const del = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ delete: del } as never);

    await resource.cancelOffer("950527619626041456");

    expect(del).toHaveBeenCalledWith("offers/950527619626041456");
  });

  it("declines an offer through the same delete route", async () => {
    const del = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ delete: del } as never);

    await resource.declineOffer("950531563567843184");

    expect(del).toHaveBeenCalledWith("offers/950531563567843184");
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

  it("requests buy orders with no params (default)", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getBuyOrders();

    expect(get).toHaveBeenCalledWith("me/buy-orders", {});
  });

  it("creates a buy order with explicit quantity", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.createBuyOrder({
      market_hash_name: "AWP | Dragon Lore (Factory New)",
      max_price: 1,
      quantity: 1,
    });

    expect(post).toHaveBeenCalledWith("buy-orders", {
      market_hash_name: "AWP | Dragon Lore (Factory New)",
      max_price: 1,
      quantity: 1,
    });
  });

  it("creates a buy order without quantity when omitted", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.createBuyOrder({
      market_hash_name: "AWP | Dragon Lore (Factory New)",
      max_price: 1,
    });

    expect(post).toHaveBeenCalledWith("buy-orders", {
      market_hash_name: "AWP | Dragon Lore (Factory New)",
      max_price: 1,
    });
  });

  it("updates a buy order", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.updateBuyOrder("950530002502421241", {
      max_price: 2,
    });

    expect(patch).toHaveBeenCalledWith("buy-orders/950530002502421241", {
      max_price: 2,
    });
  });

  it("deletes a buy order", async () => {
    const del = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ delete: del } as never);

    await resource.deleteBuyOrder("123");

    expect(del).toHaveBeenCalledWith("buy-orders/123");
  });

  it("requests auto bids", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getAutoBids();

    expect(get).toHaveBeenCalledWith("me/auto-bids");
  });

  it("deletes an auto bid", async () => {
    const del = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ delete: del } as never);

    await resource.deleteAutoBid("950552189460416427");

    expect(del).toHaveBeenCalledWith("me/auto-bids/950552189460416427");
  });

  it("requests mobile status", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new AccountResource({ get } as never);

    await resource.getMobileStatus();

    expect(get).toHaveBeenCalledWith("me/mobile/status");
  });

  it("patches generic me settings", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.updateMe({ offers_enabled: true, away: false });

    expect(patch).toHaveBeenCalledWith("me", {
      offers_enabled: true,
      away: false,
    });
  });

  it("patches offers_enabled", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.setOffersEnabled(true);

    expect(patch).toHaveBeenCalledWith("me", {
      offers_enabled: true,
    });
  });

  it("patches stall_public", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.setStallPublic(true);

    expect(patch).toHaveBeenCalledWith("me", {
      stall_public: true,
    });
  });

  it("patches away", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.setAway(false);

    expect(patch).toHaveBeenCalledWith("me", {
      away: false,
    });
  });

  it("patches max_offer_discount", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.setMaxOfferDiscount(800);

    expect(patch).toHaveBeenCalledWith("me", {
      max_offer_discount: 800,
    });
  });

  it("patches trade_url", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.updateTradeUrl("https://steamcommunity.com/tradeoffer/new/?partner=1&token=abc");

    expect(patch).toHaveBeenCalledWith("me", {
      trade_url: "https://steamcommunity.com/tradeoffer/new/?partner=1&token=abc",
    });
  });

  it("patches background_url", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.updateBackground("https://example.com/bg.jpg");

    expect(patch).toHaveBeenCalledWith("me", {
      background_url: "https://example.com/bg.jpg",
    });
  });

  it("patches username", async () => {
    const patch = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ patch } as never);

    await resource.updateUsername("newname");

    expect(patch).toHaveBeenCalledWith("me", {
      username: "newname",
    });
  });


  it("posts notification read receipt", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.markNotificationsRead("123");

    expect(post).toHaveBeenCalledWith("me/notifications/read-receipt", {
      last_read_id: "123",
    });
  });

  it("posts mobile status version", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const resource = new AccountResource({ post } as never);

    await resource.setMobileStatus();

    expect(post).toHaveBeenCalledWith("me/mobile/status", {
      version: "8.0.0",
    });
  });
});
