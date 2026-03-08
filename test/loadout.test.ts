import { describe, expect, it, vi } from "vitest";

import { LoadoutResource } from "../src/resources/loadout.js";

describe("LoadoutResource", () => {
  it("requests public loadout lists", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getLoadouts({
      sort_by: "favorites",
      limit: 20,
      months: 1,
      def_index: 7,
      paint_index: 490,
    });

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout",
      {
        sort_by: "favorites",
        limit: 20,
        months: 1,
        def_index: 7,
        paint_index: 490,
      },
    );
  });

  it("creates a loadout with a bearer token", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.createLoadout("abc123", {
      name: "SDK Temp",
      ct: { is_filled: false },
      t: { is_filled: false },
    });

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(post).toHaveBeenCalledWith("loadout", {
      name: "SDK Temp",
      ct: { is_filled: false },
      t: { is_filled: false },
    });
  });

  it("requests public user loadouts", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getUserLoadouts("76561198771627775");

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/user/76561198771627775/loadouts",
    );
  });

  it("requests a single public loadout", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getLoadout("154023336572224457");

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout/154023336572224457",
    );
  });

  it("clones a public loadout through createLoadout", async () => {
    const get = vi.fn(async (_path: string) => ({
      loadout: {
        name: "Loadout 1",
        ct: { is_filled: false },
        t: { is_filled: false },
      },
    }));
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ get, derive } as never);

    await resource.cloneLoadout("abc123", "154023336572224457");

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout/154023336572224457",
    );
    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(post).toHaveBeenCalledWith("loadout", {
      name: "Loadout 1 (Clone)",
      ct: { is_filled: false },
      t: { is_filled: false },
    });
  });

  it("requests bearer-token favorite loadouts", async () => {
    const get = vi.fn(async (_path: string) => null);
    const derive = vi.fn(() => ({ get }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.getFavoriteLoadouts("abc123");

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(get).toHaveBeenCalledWith("user/favorites");
  });

  it("requests bearer-token recommendations", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.recommend("abc123", {
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 5,
      def_whitelist: [7, 9, 13],
      def_blacklist: [],
    });

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(post).toHaveBeenCalledWith("recommend", {
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 5,
      def_whitelist: [7, 9, 13],
      def_blacklist: [],
    });
  });

  it("requests bearer-token sticker recommendations", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.recommendStickers("abc123", {
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 10,
      collection_whitelist: ["Holo"],
    });

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(post).toHaveBeenCalledWith("recommend/stickers", {
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 10,
      collection_whitelist: ["Holo"],
    });
  });

  it("requests bearer-token generated loadout recommendations", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.generateRecommendations("abc123", {
      items: [{ type: "skin", def_index: 7, paint_index: 490, wear_index: 2 }],
      def_indexes: [7, 13, 39, 9],
      faction: "t",
      max_price: 3000,
    });

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(post).toHaveBeenCalledWith("generate", {
      items: [{ type: "skin", def_index: 7, paint_index: 490, wear_index: 2 }],
      def_indexes: [7, 13, 39, 9],
      faction: "t",
      max_price: 3000,
    });
  });

  it("updates a loadout with a bearer token", async () => {
    const put = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ put }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.updateLoadout("abc123", "154023336572224457", {
      name: "SDK Updated",
      ct: { is_filled: false },
      t: { is_filled: false },
    });

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(put).toHaveBeenCalledWith("loadout/154023336572224457", {
      name: "SDK Updated",
      ct: { is_filled: false },
      t: { is_filled: false },
    });
  });

  it("favorites a loadout with a bearer token", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.favoriteLoadout("abc123", "154023336572224457");

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(post).toHaveBeenCalledWith("loadout/154023336572224457/favorite", {});
  });

  it("unfavorites a loadout with a bearer token", async () => {
    const del = vi.fn(async (_path: string) => null);
    const derive = vi.fn(() => ({ delete: del }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.unfavoriteLoadout("abc123", "154023336572224457");

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(del).toHaveBeenCalledWith("loadout/154023336572224457/favorite");
  });

  it("deletes a loadout with a bearer token", async () => {
    const del = vi.fn(async (_path: string) => null);
    const derive = vi.fn(() => ({ delete: del }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.deleteLoadout("abc123", "154023336572224457");

    expect(derive).toHaveBeenCalledWith({
      apiKey: "Bearer abc123",
      baseUrl: "https://loadout-api.csfloat.com/v1",
    });
    expect(del).toHaveBeenCalledWith("loadout/154023336572224457");
  });
});
