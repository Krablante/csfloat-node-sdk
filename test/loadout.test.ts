import { describe, expect, it, vi } from "vitest";

import {
  buildGenerateLoadoutRecommendationsRequest,
  buildLoadoutListParams,
  buildLoadoutRecommendationRequest,
  buildLoadoutSkinSearchParams,
  buildSingleSkinRecommendationRequest,
  buildSingleSkinStickerRecommendationRequest,
  buildStickerRecommendationRequest,
  CSFLOAT_DISCOVER_LOADOUT_PARAMS,
  CSFLOAT_LOADOUT_FACTIONS,
  CSFLOAT_LOADOUT_MAX_LIMIT,
  CSFLOAT_LOADOUT_SORT_OPTIONS,
  CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT,
  getDiscoverLoadoutParams,
} from "../src/loadout.js";
import { LoadoutResource } from "../src/resources/loadout.js";

describe("LoadoutResource", () => {
  it("exports stable loadout helper constants", () => {
    expect(CSFLOAT_LOADOUT_SORT_OPTIONS).toEqual([
      "favorites",
      "random",
      "created_at",
    ]);
    expect(CSFLOAT_DISCOVER_LOADOUT_PARAMS).toEqual({
      any_filled: true,
      limit: 100,
      months: 1,
      sort_by: "favorites",
    });
    expect(CSFLOAT_LOADOUT_FACTIONS).toEqual(["ct", "t"]);
    expect(CSFLOAT_LOADOUT_MAX_LIMIT).toBe(200);
    expect(CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT).toBe(100);
  });

  it("builds discover loadout params", () => {
    expect(getDiscoverLoadoutParams()).toEqual({
      any_filled: true,
      limit: 100,
      months: 1,
      sort_by: "favorites",
    });
    expect(getDiscoverLoadoutParams({ limit: 20, def_index: 7, paint_index: 490 })).toEqual({
      any_filled: true,
      limit: 20,
      months: 1,
      sort_by: "favorites",
      def_index: 7,
      paint_index: 490,
    });
  });

  it("builds validated loadout list params", () => {
    expect(
      buildLoadoutListParams({
        any_filled: true,
        def_index: 7,
        limit: 20,
        months: 3,
        paint_index: 490,
        sort_by: "favorites",
      }),
    ).toEqual({
      any_filled: true,
      def_index: 7,
      limit: 20,
      months: 3,
      paint_index: 490,
      sort_by: "favorites",
    });
  });

  it("builds validated paired skin search params", () => {
    expect(
      buildLoadoutSkinSearchParams({
        def_index: 7,
        paint_index: 490,
        months: 1,
      }),
    ).toEqual({
      def_index: 7,
      paint_index: 490,
      months: 1,
    });
  });

  it("builds validated recommendation helpers", () => {
    expect(
      buildLoadoutRecommendationRequest({
        items: [{ type: "skin", def_index: 7, paint_index: 490 }],
        count: 5,
        def_whitelist: [7, 9],
      }),
    ).toEqual({
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 5,
      def_whitelist: [7, 9],
    });

    expect(
      buildStickerRecommendationRequest({
        items: [{ type: "skin", def_index: 7, paint_index: 490 }],
        count: 10,
        collection_whitelist: ["Holo"],
      }),
    ).toEqual({
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 10,
      collection_whitelist: ["Holo"],
    });

    expect(
      buildGenerateLoadoutRecommendationsRequest({
        items: [{ type: "skin", def_index: 7, paint_index: 490, wear_index: 2 }],
        def_indexes: [7, 13, 39, 9],
        faction: "t",
        max_price: 3000,
      }),
    ).toEqual({
      items: [{ type: "skin", def_index: 7, paint_index: 490, wear_index: 2 }],
      def_indexes: [7, 13, 39, 9],
      faction: "t",
      max_price: 3000,
    });
  });

  it("builds single-skin recommendation helper requests", () => {
    expect(
      buildSingleSkinRecommendationRequest(7, 490, {
        count: 5,
        def_blacklist: [60],
      }),
    ).toEqual({
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 5,
      def_blacklist: [60],
    });

    expect(
      buildSingleSkinStickerRecommendationRequest(7, 490, {
        count: 10,
        collection_whitelist: ["Holo"],
      }),
    ).toEqual({
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 10,
      collection_whitelist: ["Holo"],
    });
  });

  it("rejects invalid loadout helper params", () => {
    expect(() =>
      buildLoadoutListParams({
        def_index: 7,
      } as never),
    ).toThrow("def_index and paint_index must be provided together");

    expect(() =>
      buildLoadoutListParams({
        limit: 201,
      }),
    ).toThrow("limit must be between 1 and 200");

    expect(() =>
      buildLoadoutListParams({
        months: 0,
      }),
    ).toThrow("months must be an integer greater than or equal to 1");

    expect(() =>
      buildLoadoutRecommendationRequest({
        items: [{ type: "skin", def_index: 7, paint_index: 490 }],
        count: -1,
      }),
    ).toThrow("count must be an integer greater than or equal to 0");

    expect(() =>
      buildStickerRecommendationRequest({
        items: [{ type: "skin", def_index: 7, paint_index: 490 }],
        count: 101,
      }),
    ).toThrow("count must be between 0 and 100");

    expect(() =>
      buildGenerateLoadoutRecommendationsRequest({
        items: [],
        def_indexes: [],
        faction: "t",
      }),
    ).toThrow("def_indexes must contain at least one weapon id");

    expect(() =>
      buildGenerateLoadoutRecommendationsRequest({
        items: [],
        def_indexes: [7],
        faction: "t",
        max_price: 0,
      }),
    ).toThrow("max_price must be an integer greater than or equal to 1");
  });

  it("requests public loadout lists", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getLoadouts({
      any_filled: true,
      sort_by: "favorites",
      limit: 20,
      months: 1,
      def_index: 7,
      paint_index: 490,
    });

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout",
      {
        any_filled: true,
        sort_by: "favorites",
        limit: 20,
        months: 1,
        def_index: 7,
        paint_index: 490,
      },
    );
  });

  it("requests discover loadouts with the public discover defaults", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getDiscoverLoadouts({
      limit: 20,
      def_index: 7,
      paint_index: 490,
    });

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout",
      {
        any_filled: true,
        sort_by: "favorites",
        limit: 20,
        months: 1,
        def_index: 7,
        paint_index: 490,
      },
    );
  });

  it("requests paired skin loadouts with validated skin params", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getSkinLoadouts(7, 490, {
      limit: 20,
      months: 1,
      sort_by: "favorites",
    });

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout",
      {
        def_index: 7,
        limit: 20,
        months: 1,
        paint_index: 490,
        sort_by: "favorites",
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

  it("requests bearer-token recommendations for a single skin", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.recommendForSkin("abc123", 7, 490, {
      count: 5,
      def_blacklist: [60],
    });

    expect(post).toHaveBeenCalledWith("recommend", {
      items: [{ type: "skin", def_index: 7, paint_index: 490 }],
      count: 5,
      def_blacklist: [60],
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

  it("requests bearer-token sticker recommendations for a single skin", async () => {
    const post = vi.fn(async (_path: string, _body: unknown) => null);
    const derive = vi.fn(() => ({ post }));
    const resource = new LoadoutResource({ derive } as never);

    await resource.recommendStickersForSkin("abc123", 7, 490, {
      count: 10,
      collection_whitelist: ["Holo"],
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
