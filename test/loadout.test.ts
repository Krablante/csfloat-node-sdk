import { describe, expect, it, vi } from "vitest";

import { LoadoutResource } from "../src/resources/loadout.js";

describe("LoadoutResource", () => {
  it("requests public loadout lists", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getLoadouts({ sort_by: "favorites" });

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout",
      { sort_by: "favorites" },
    );
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
});
